from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.plan import Plan
from app.models.user import User

plans_bp = Blueprint('plans', __name__)


def _serialize_plan(plan):
    return {
        'id': plan.id,
        'title': plan.title,
        'description': plan.description,
        'location': plan.location,
        'category': plan.category,
        'status': plan.status,
        'date_range_start': plan.date_range_start.isoformat() if plan.date_range_start else None,
        'date_range_end': plan.date_range_end.isoformat() if plan.date_range_end else None,
        'final_start_time': plan.final_start_time.isoformat() if plan.final_start_time else None,
        'final_end_time': plan.final_end_time.isoformat() if plan.final_end_time else None,
        'created_at': plan.created_at.isoformat() if plan.created_at else None,
        'creator_id': plan.creator_id
    }


@plans_bp.route('/', methods=['GET'])
@jwt_required()
def get_plans():
    current_user_id = get_jwt_identity()
    plans = Plan.query.filter_by(creator_id=current_user_id).all()
    return jsonify([_serialize_plan(p) for p in plans]), 200


@plans_bp.route('/', methods=['POST'])
@jwt_required()
def create_plan():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get('title'):
        return jsonify({'error': 'title is required'}), 400

    new_plan = Plan()
    new_plan.title = data['title']
    new_plan.description = data.get('description')
    new_plan.location = data.get('location')
    new_plan.category = data.get('category')
    new_plan.status = 'draft'
    new_plan.creator_id = int(current_user_id)

    # optional date range from the CreatePlanScreen date pickers
    if data.get('date_range_start'):
        from datetime import datetime
        new_plan.date_range_start = datetime.fromisoformat(data['date_range_start'])
    if data.get('date_range_end'):
        from datetime import datetime
        new_plan.date_range_end = datetime.fromisoformat(data['date_range_end'])

    db.session.add(new_plan)
    db.session.commit()

    return jsonify({
        'message': 'plan created successfully',
        'plan': _serialize_plan(new_plan)
    }), 201


@plans_bp.route('/<int:plan_id>', methods=['GET'])
@jwt_required()
def get_plan(plan_id):
    current_user_id = get_jwt_identity()
    plan = db.session.get(Plan, plan_id)

    if not plan:
        return jsonify({'error': 'plan not found'}), 404

    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'unauthorized'}), 403

    return jsonify(_serialize_plan(plan)), 200


@plans_bp.route('/<int:plan_id>', methods=['PUT'])
@jwt_required()
def update_plan(plan_id):
    current_user_id = get_jwt_identity()
    plan = db.session.get(Plan, plan_id)

    if not plan:
        return jsonify({'error': 'plan not found'}), 404

    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'unauthorized'}), 403

    data = request.get_json()

    # only overwrite fields that were explicitly sent
    for field in ('title', 'description', 'location', 'category', 'status'):
        if data.get(field) is not None:
            setattr(plan, field, data[field])

    if data.get('date_range_start') is not None:
        from datetime import datetime
        plan.date_range_start = datetime.fromisoformat(data['date_range_start']) if data['date_range_start'] else None
    if data.get('date_range_end') is not None:
        from datetime import datetime
        plan.date_range_end = datetime.fromisoformat(data['date_range_end']) if data['date_range_end'] else None
    if data.get('final_start_time') is not None:
        from datetime import datetime
        plan.final_start_time = datetime.fromisoformat(data['final_start_time']) if data['final_start_time'] else None
    if data.get('final_end_time') is not None:
        from datetime import datetime
        plan.final_end_time = datetime.fromisoformat(data['final_end_time']) if data['final_end_time'] else None

    db.session.commit()

    return jsonify({'message': 'plan updated successfully', 'plan': _serialize_plan(plan)}), 200


@plans_bp.route('/<int:plan_id>', methods=['DELETE'])
@jwt_required()
def delete_plan(plan_id):
    current_user_id = get_jwt_identity()
    plan = db.session.get(Plan, plan_id)

    if not plan:
        return jsonify({'error': 'plan not found'}), 404

    if str(plan.creator_id) != current_user_id:
        return jsonify({'error': 'unauthorized'}), 403

    db.session.delete(plan)
    db.session.commit()

    return jsonify({'message': 'plan deleted successfully'}), 200
