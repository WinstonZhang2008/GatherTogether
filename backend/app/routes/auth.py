import secrets
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # frontend sends firstName + lastName separately; combine them
    first_name = (data.get('firstName') or '').strip()
    last_name  = (data.get('lastName') or '').strip()
    name       = (first_name + ' ' + last_name).strip() or data.get('name', '').strip()

    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'name, email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'email already registered'}), 409

    new_user = User()
    new_user.name = name
    new_user.email = email
    new_user.password_hash = generate_password_hash(password)
    new_user.phone = data.get('phone')
    new_user.dietary_tags = data.get('dietary_tags')
    new_user.budget_range = data.get('budget_range')
    new_user.accessibility_needs = data.get('accessibility_needs')

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=str(new_user.id))

    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'success': False, 'message': 'email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    # same vague error whether email or password is wrong — don't leak which
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'success': False, 'message': 'invalid email or password'}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200


@auth_bp.route('/google', methods=['POST'])
def google_auth():
    data       = request.get_json()
    credential = data.get('credential')

    if not credential:
        return jsonify({'success': False, 'message': 'No credential provided'}), 400

    try:
        id_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            current_app.config['GOOGLE_CLIENT_ID']
        )
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid Google token'}), 400

    email = id_info.get('email', '').lower()
    name  = id_info.get('name', '')

    if not email:
        return jsonify({'success': False, 'message': 'Could not get email from Google'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User()
        user.email         = email
        user.name          = name
        user.password_hash = generate_password_hash(secrets.token_hex(32))
        db.session.add(user)
        db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'token': token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email}
    }), 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data  = request.get_json()
    email = (data.get('email') or '').strip().lower()

    if not email:
        return jsonify({'success': False, 'message': 'email is required'}), 400

    # Always return success — don't reveal whether the email exists
    user = User.query.filter_by(email=email).first()
    if user:
        # TODO: generate a time-limited reset token and email it
        # reset_token = create_access_token(identity=str(user.id), expires_delta=timedelta(minutes=30))
        # send_password_reset_email(user.email, reset_token)
        pass

    return jsonify({'success': True, 'message': 'If that email is registered, a reset link has been sent.'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))

    if not user:
        return jsonify({'error': 'user not found'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'photo_url': user.photo_url,
        'dietary_tags': user.dietary_tags,
        'budget_range': user.budget_range,
        'accessibility_needs': user.accessibility_needs
    }), 200


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))

    if not user:
        return jsonify({'error': 'user not found'}), 404

    data = request.get_json()

    # only update fields that were explicitly sent; None means "not sent"
    if data.get('name') is not None:
        user.name = data['name'].strip()
    if data.get('phone') is not None:
        user.phone = data['phone']
    if data.get('photo_url') is not None:
        user.photo_url = data['photo_url']
    if data.get('dietary_tags') is not None:
        user.dietary_tags = data['dietary_tags']
    if data.get('budget_range') is not None:
        user.budget_range = data['budget_range']
    if data.get('accessibility_needs') is not None:
        user.accessibility_needs = data['accessibility_needs']

    db.session.commit()

    return jsonify({
        'success': True,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'photo_url': user.photo_url,
            'dietary_tags': user.dietary_tags,
            'budget_range': user.budget_range,
            'accessibility_needs': user.accessibility_needs
        }
    }), 200
