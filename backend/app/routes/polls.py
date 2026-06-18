from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.plan import Plan
from app.models.poll import Poll, PollOption, Vote

# Define our blueprint. This registers with '/api/polls' via your route hub.
polls_bp = Blueprint('polls', __name__)


# CREATE A POLL: Let the host propose options (like 3 different dates or locations)
# POST request because the frontend is submitting new form/poll data to the database.
@polls_bp.route('/<int:plan_id>', methods=['POST'])
@jwt_required()  # Guard layer: Ensures a valid user token is attached to the request header
def create_poll(plan_id):
    # 1. Look up who is making this request using their securely encrypted JWT payload
    current_user_id = get_jwt_identity()
    
    # 2. Look up the plan. If the ID doesn't exist, stop execution and reply with a 404.
    plan = Plan.query.get_or_404(plan_id)
    
    # 3. Security Check: Only the host (creator) of the plan should be allowed to build a poll.
    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'Unauthorized. Only the plan creator can make a poll.'}), 403
        
    # 4. Extract the payload sent by the frontend
    data = request.get_json()
    
    # 5. Data Validation: Ensure the user actually typed a question and provided options list
    if not data or not data.get('question') or not data.get('options'):
        return jsonify({'error': 'question and options list are required'}), 400
        
    # 6. Stage the master Poll question block in the application's RAM
    new_poll = Poll(
        plan_id=plan_id,
        question=data['question']
    )
    db.session.add(new_poll)
    
    # 7. CRITICAL STEP: db.session.flush() writes the poll row to the database *temporarily*
    # without finalizing the save transaction. This generates an automated ID (e.g., Poll #12)
    # which we instantly need below to map each voting option back to this parent poll.
    db.session.flush() 
    
    # 8. Loop through the list of options (e.g., ["Friday 6pm", "Saturday 2pm"]) sent by frontend
    for option_text in data['options']:
        # Assign each option text to our sub-table, linking it to the freshly flashed parent poll ID
        option = PollOption(poll_id=new_poll.id, option_text=option_text)
        db.session.add(option)
        
    # 9. Commit both the Poll and all its options together safely in one transaction
    db.session.commit()
    return jsonify({'message': 'Poll created successfully', 'poll_id': new_poll.id}), 201


# VOTE ON AN OPTION: Allow friends to tap/click a choice to vote
# POST request because we are submitting a vote payload to the database
@polls_bp.route('/vote/<int:option_id>', methods=['POST'])
@jwt_required()
def cast_vote(option_id):
    current_user_id = get_jwt_identity()
    
    # Verify the specific choice button clicked actually maps to a real choice row in our DB
    option = PollOption.query.get_or_404(option_id)
    
    # Check if this user has already voted for this exact option before
    existing_vote = Vote.query.filter_by(option_id=option_id, user_id=current_user_id).first()
    
    if existing_vote:
        # USER EXPERIENCE CHOICE: If they click an already voted choice, they want to undo it!
        # This deletes their row out of the database, clearing their vote.
        db.session.delete(existing_vote)
        db.session.commit()
        return jsonify({'message': 'Vote removed successfully'}), 200
        
    # If no previous vote exists, create a brand new Vote record mapping User ID -> Option ID
    new_vote = Vote(option_id=option_id, user_id=current_user_id)
    db.session.add(new_vote)
    db.session.commit()
    return jsonify({'message': 'Vote cast successfully'}), 201


# GET RESULTS: Fetch the current score tallies for a plan's poll
# GET request because the frontend is purely reading data to display charts/tallies
@polls_bp.route('/<int:plan_id>', methods=['GET'])
@jwt_required()
def get_poll_results(plan_id):
    # Find the poll attached to this plan
    poll = Poll.query.filter_by(plan_id=plan_id).first()
    if not poll:
        return jsonify({'error': 'No poll found for this plan'}), 404
        
    # Python Serialization: Convert database objects into safe JSON lists the frontend understands
    options_data = []
    for option in poll.options:
        options_data.append({
            'id': option.id,
            'option_text': option.option_text,
            # len() counts the rows connected to this option via SQLAlchemy's relationship tracking
            'votes_count': len(option.votes) 
        })
        
    return jsonify({
        'poll_id': poll.id,
        'question': poll.question,
        'options': options_data
    }), 200