from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.plan import Plan
from app.models.user import User

plans_bp = Blueprint('plans', __name__)


@plans_bp.route('/', methods=['GET'])
@jwt_required()
def get_plans():
    # get the logged in user's id from their token
    current_user_id = get_jwt_identity()

    # get all plans where this user is the creator.
    # filter_by() is like SQL WHERE — it narrows down the results.
    plans = Plan.query.filter_by(creator_id=current_user_id).all()

    # we can't return Python objects directly — we need to convert
    # each plan to a dict first. this is called serialization.
    result = []
    for plan in plans:
        result.append({
            'id': plan.id,
            'title': plan.title,
            'description': plan.description,
            'location': plan.location,
            'status': plan.status,
            'final_start_time': plan.final_start_time,
            'final_end_time': plan.final_end_time,
            'created_at': plan.created_at
        })

    return jsonify(result), 200


@plans_bp.route('/', methods=['POST'])
@jwt_required()
def create_plan():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # validate required fields
    if not data.get('title'):
        return jsonify({'error': 'title is required'}), 400

    new_plan = Plan(
        title=data['title'],
        description=data.get('description'),
        location=data.get('location'),
        status='planning',
        # creator_id links this plan to the logged in user.
        # we get this from the token so the frontend never
        # needs to send it — users can't fake being someone else.
        creator_id=current_user_id
    )

    db.session.add(new_plan)
    db.session.commit()

    return jsonify({
        'message': 'plan created successfully',
        'plan': {
            'id': new_plan.id,
            'title': new_plan.title,
            'status': new_plan.status,
            'creator_id': new_plan.creator_id
        }
    }), 201


# <int:plan_id> is a URL parameter — it captures whatever number
# is in the URL. so GET /api/plans/5 would set plan_id = 5.
@plans_bp.route('/<int:plan_id>', methods=['GET'])
@jwt_required()
def get_plan(plan_id):
    current_user_id = get_jwt_identity()

    # get_or_404() looks up by id and automatically returns a
    # 404 error if nothing is found — saves you writing that check.
    plan = Plan.query.get_or_404(plan_id)

    # make sure the logged in user actually owns this plan.
    # without this check anyone could read anyone else's plans.
    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'unauthorized'}), 403

    return jsonify({
        'id': plan.id,
        'title': plan.title,
        'description': plan.description,
        'location': plan.location,
        'status': plan.status,
        'final_start_time': plan.final_start_time,
        'final_end_time': plan.final_end_time,
        'created_at': plan.created_at,
        'creator_id': plan.creator_id
    }), 200


@plans_bp.route('/<int:plan_id>', methods=['PUT'])
@jwt_required()
def update_plan(plan_id):
    current_user_id = get_jwt_identity()
    plan = Plan.query.get_or_404(plan_id)

    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'unauthorized'}), 403

    data = request.get_json()

    # only update fields that were actually sent.
    # data.get() returns None if the key doesn't exist,
    # so we use "or plan.field" to keep the existing value
    # if nothing new was sent.
    plan.title = data.get('title') or plan.title
    plan.description = data.get('description') or plan.description
    plan.location = data.get('location') or plan.location
    plan.status = data.get('status') or plan.status
    plan.final_start_time = data.get('final_start_time') or plan.final_start_time
    plan.final_end_time = data.get('final_end_time') or plan.final_end_time

    db.session.commit()

    return jsonify({'message': 'plan updated successfully'}), 200


@plans_bp.route('/<int:plan_id>', methods=['DELETE'])
@jwt_required()
def delete_plan(plan_id):
    current_user_id = get_jwt_identity()
    plan = Plan.query.get_or_404(plan_id)

    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'unauthorized'}), 403

    # cascade="all, delete-orphan" in the model means deleting
    # a plan automatically deletes all its related availability,
    # polls and notifications too — no orphaned data left behind.
    db.session.delete(plan)
    db.session.commit()

    return jsonify({'message': 'plan deleted successfully'}), 200