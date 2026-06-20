from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.availability import Availability
from app.models.plan import Plan

# Define our blueprint. This registers with '/api/availability' via your route hub.
availability_bp = Blueprint('availability', __name__)


# 1. SUBMIT OR UPDATE AVAILABILITY FOR A PLAN
# POST request because users are sending their personal schedule data to save
@availability_bp.route('/<int:plan_id>', methods=['POST'])
@jwt_required()
def submit_availability(plan_id):
    # Grab the logged-in user's secure ID from their JWT token
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # 1. Verification: Make sure the plan they are submitting times for actually exists
    plan = Plan.query.get_or_404(plan_id)
    
    # 2. Validation: Ensure they actually sent a list of times
    if not data or not data.get('available_slots'):
        return jsonify({'error': 'available_slots data is required'}), 400

    # 3. Check if this user has already submitted availability for this plan before.
    # We don't want a user having 5 different availability rows for the same event.
    existing_avail = Availability.query.filter_by(plan_id=plan_id, user_id=current_user_id).first()
    
    if existing_avail:
        # USER EXPERIENCE CHOICE: If they already submitted times, they are likely updating them.
        # Overwrite their old slots with the new ones they just selected.
        # (Note: 'available_slots' is typically stored as a JSON array of time blocks in the DB)
        existing_avail.available_slots = data['available_slots']
        db.session.commit()
        return jsonify({'message': 'Availability updated successfully'}), 200
    else:
        new_avail = Availability()
        new_avail.plan_id = plan_id
        new_avail.user_id = int(current_user_id)
        new_avail.available_slots = data['available_slots']
        db.session.add(new_avail)
        db.session.commit()
        return jsonify({'message': 'Availability submitted successfully'}), 201


# 2. GET ALL SUBMITTED AVAILABILITIES FOR A PLAN
# GET request because the frontend needs to fetch everyone's times to display an overlapping calendar heat-map
@availability_bp.route('/<int:plan_id>', methods=['GET'])
@jwt_required()
def get_plan_availabilities(plan_id):
    # Ensure the plan exists
    plan = Plan.query.get_or_404(plan_id)
    
    # Query the database to find ALL availability records linked to this plan ID
    availabilities = Availability.query.filter_by(plan_id=plan_id).all()
    
    # Map the database rows into a clean list of Python dictionaries (Serialization)
    result = []
    for avail in availabilities:
        result.append({
            'id': avail.id,
            'user_id': avail.user_id,
            # This returns the array of chosen time blocks back to the frontend
            'available_slots': avail.available_slots,
            'updated_at': avail.updated_at
        })
        
    return jsonify(result), 200


# 3. DELETE MY AVAILABILITY FOR A PLAN
# DELETE request because a user wants to pull out of an event completely or clear their choices
@availability_bp.route('/<int:plan_id>', methods=['DELETE'])
@jwt_required()
def delete_availability(plan_id):
    current_user_id = get_jwt_identity()
    
    # Find the exact availability row for this specific user on this specific plan
    avail = Availability.query.filter_by(plan_id=plan_id, user_id=current_user_id).first()
    
    if not avail:
        return jsonify({'error': 'No availability record found to delete'}), 404
        
    # Remove it from the database session and save the changes
    db.session.delete(avail)
    db.session.commit()
    
    return jsonify({'message': 'Your availability was cleared successfully'}), 200