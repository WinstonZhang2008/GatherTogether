import secrets
import re
from datetime import timedelta
from flask import Blueprint, request, jsonify, current_app, redirect
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app import db
from app.models.user import User
from app.utils.email import send_welcome_email, send_verification_email

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    first_name = (data.get('firstName') or '').strip()
    last_name  = (data.get('lastName') or '').strip()
    name       = (first_name + ' ' + last_name).strip() or data.get('name', '').strip()

    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'name, email and password are required'}), 400

    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify({'success': False, 'message': 'Please enter a valid email address.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'An account with that email already exists.'}), 409

    new_user = User()
    new_user.name          = name
    new_user.email         = email
    new_user.password_hash = generate_password_hash(password)
    new_user.is_verified   = False
    new_user.phone         = data.get('phone')
    new_user.dietary_tags  = data.get('dietary_tags')
    new_user.budget_range  = data.get('budget_range')
    new_user.accessibility_needs = data.get('accessibility_needs')

    db.session.add(new_user)
    db.session.commit()

    verify_token = create_access_token(
        identity=str(new_user.id),
        additional_claims={'purpose': 'email_verification'},
        expires_delta=timedelta(hours=24)
    )
    send_verification_email(new_user.email, new_user.name, verify_token)

    return jsonify({
        'success': True,
        'requiresVerification': True,
        'message': 'Account created! Check your email to verify your account before logging in.'
    }), 201


@auth_bp.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    try:
        decoded = decode_token(token)
        if decoded.get('purpose') != 'email_verification':
            raise ValueError('wrong purpose')
        user_id = int(decoded['sub'])
    except Exception:
        return '''
        <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#F6FAF8;">
          <h2 style="color:#C0392B;">Invalid or expired link</h2>
          <p>This verification link has expired or is invalid.</p>
          <a href="http://127.0.0.1:5500/GatherTogether/frontend/index.html" style="color:#1D9E75;">Back to Gather</a>
        </body></html>
        ''', 400

    user = db.session.get(User, user_id)
    if not user:
        return redirect('http://127.0.0.1:5500/GatherTogether/frontend/index.html')

    user.is_verified = True
    db.session.commit()

    return '''
    <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#F6FAF8;">
      <div style="max-width:400px;margin:0 auto;">
        <div style="width:64px;height:64px;background:#E1F5EE;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14l6 6 10-10" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2 style="font-family:sans-serif;color:#111714;margin-bottom:8px;">Email confirmed!</h2>
        <p style="color:#4A5751;margin-bottom:28px;">Your account is now active. You can log in to Gather.</p>
        <a href="http://127.0.0.1:5500/GatherTogether/frontend/index.html" style="background:#1D9E75;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">Log in to Gather</a>
      </div>
    </body></html>
    '''


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'success': False, 'message': 'email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'success': False, 'message': 'invalid email or password'}), 401

    if not user.is_verified:
        return jsonify({'success': False, 'message': 'Please verify your email before logging in. Check your inbox for the confirmation link.'}), 403

    token = create_access_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'token': token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email}
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
        user.is_verified   = True
        db.session.add(user)
        db.session.commit()
        send_welcome_email(user.email, user.name)

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

    user = User.query.filter_by(email=email).first()
    if user:
        # TODO: generate a time-limited reset token and email it
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
