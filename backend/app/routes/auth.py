from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models.user import User

# creates the blueprint. first argument is the name Flask uses
# internally, second is standard __name__. this blueprint gets
# registered in routes/__init__.py with the /api/auth prefix.
auth_bp = Blueprint('auth', __name__)


# @auth_bp.route defines a URL endpoint. the methods list tells
# Flask which HTTP methods are allowed — POST means the frontend
# is sending data to us (like a form submission).
@auth_bp.route('/register', methods=['POST'])
def register():
    # request.get_json() reads the JSON body the frontend sends.
    # e.g. { "name": "Jamie", "email": "jamie@email.com", "password": "abc123" }
    data = request.get_json()

    # basic validation — check required fields exist
    if not data.get('email') or not data.get('password') or not data.get('name'):
        # jsonify() converts a Python dict into a JSON response.
        # the second argument is the HTTP status code —
        # 400 means "bad request" (the client sent bad data).
        return jsonify({'error': 'name, email and password are required'}), 400

    # check if a user with this email already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'email already registered'}), 409

    # never store plain text passwords. generate_password_hash()
    # runs it through bcrypt so even if the database is breached,
    # passwords are unreadable.
    hashed_password = generate_password_hash(data['password'])

    # create a new User object — this doesn't hit the database yet,
    # it just creates the Python object in memory.
    new_user = User(
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password,
        phone=data.get('phone'),
        dietary_tags=data.get('dietary_tags'),
        budget_range=data.get('budget_range'),
        accessibility_needs=data.get('accessibility_needs')
    )

    # db.session.add() stages the new user to be saved.
    # db.session.commit() actually writes it to the database.
    # think of it like writing a document — add() is typing it,
    # commit() is hitting save.
    db.session.add(new_user)
    db.session.commit()

    # create a JWT token for the new user so they're
    # automatically logged in after registering.
    # identity is what gets stored inside the token —
    # we use the user's id so we can look them up later.
    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({
        'message': 'user created successfully',
        'access_token': access_token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'email and password are required'}), 400

    # look up the user by email
    user = User.query.filter_by(email=data['email']).first()

    # check_password_hash() compares the plain password the user
    # typed against the stored hash. if user doesn't exist or
    # password is wrong we return the same vague error — we don't
    # want to tell attackers which one was wrong.
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'invalid email or password'}), 401

    # 401 means "unauthorized" — the user isn't authenticated.
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200


# @jwt_required() protects this route — if the request doesn't
# include a valid JWT token in the header, Flask automatically
# returns a 401 before your code even runs.
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    # get_jwt_identity() reads the identity we stored in the token
    # when the user logged in — which is their user id.
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'user not found'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'dietary_tags': user.dietary_tags,
        'budget_range': user.budget_range,
        'accessibility_needs': user.accessibility_needs
    }), 200