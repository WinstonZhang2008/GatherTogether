from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.notification import Notification

# Define our blueprint. This registers with '/api/notifications' via your route hub.
notifications_bp = Blueprint('notifications', __name__)


# GET USER NOTIFICATIONS: Fetch an alert feed (e.g., "Jamie updated the event location!")
# GET request because we are retrieving data to populate an inbox feed
@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    
    # Query database for items belonging explicitly to this logged-in individual.
    # order_by() arranges them with desc() so the newest updates appear at the top of their feed.
    notifications = Notification.query.filter_by(user_id=current_user_id)\
                                      .order_by(Notification.created_at.desc()).all()
    
    # Map the database structures cleanly into a Python dictionary list
    result = []
    for notif in notifications:
        result.append({
            'id': notif.id,
            'plan_id': notif.plan_id,
            'message': notif.message,
            'is_read': notif.is_read,  # Boolean field: True or False
            'created_at': notif.created_at
        })
        
    return jsonify(result), 200


# MARK SINGLE NOTIFICATION AS READ: Clears an alert when a user clicks on it
# PUT request because we are modifying/updating an existing row's true/false status
@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    current_user_id = get_jwt_identity()
    
    # Grab the precise notification row
    notification = Notification.query.get_or_404(notification_id)
    
    # Security Validation: Block malicious actors from hacking or dismissing other users' alerts
    if str(notification.user_id) != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Toggle our database status variable to True and commit the modification
    notification.is_read = True
    db.session.commit()
    
    return jsonify({'message': 'Notification marked as read'}), 200


# MARK ALL AS READ: A convenience button (like "Clear All") for the user
# PUT request because we are updating multiple records at the same time
@notifications_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_read():
    current_user_id = get_jwt_identity()
    
    # PERFORMANCE TACTIC: Using .update() performs a bulk SQL operation directly inside the
    # database engine. This is significantly faster than writing a python loop to change 50 rows one-by-one.
    # synchronize_session=False tells SQLAlchemy it doesn't need to waste resources updating its cache memory.
    Notification.query.filter_by(user_id=current_user_id, is_read=False)\
                      .update({Notification.is_read: True}, synchronize_session=False)
                      
    db.session.commit()
    return jsonify({'message': 'All notifications cleared'}), 200