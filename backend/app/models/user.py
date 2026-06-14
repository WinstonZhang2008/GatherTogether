from app import db
from datetime import datetime

# a Model is a Python class that represents a database table.
# each attribute you define becomes a column in that table.
# SQLAlchemy reads these classes and knows how to create/query the table.
class User(db.Model):

    # tells SQLAlchemy the exact table name to create in the database.
    # without this it would just guess based on the class name.
    __tablename__ = 'users'

    # db.Column defines a column. the first argument is the data type,
    # the rest are options like primary_key, nullable, unique etc.
    id = db.Column(db.Integer, primary_key=True)

    # nullable=False means this field is required — the database will
    # reject any row that doesn't have a value for it.
    name = db.Column(db.String(100), nullable=False)

    # unique=True means no two users can have the same email.
    email = db.Column(db.String(120), unique=True, nullable=False)

    # we never store plain passwords — only the hashed version.
    # the route file will handle the hashing logic.
    password_hash = db.Column(db.String(255), nullable=False)

    phone = db.Column(db.String(20), nullable=True)
    photo_url = db.Column(db.String(255), nullable=True)

    # dietary tags, budget etc. stored as JSON so we can store
    # flexible data (arrays, objects) without needing extra tables.
    dietary_tags = db.Column(db.JSON, nullable=True)
    budget_range = db.Column(db.String(10), nullable=True)
    accessibility_needs = db.Column(db.JSON, nullable=True)

    # calendar token for Google/Apple calendar integration.
    # stored as JSON since it contains multiple values (access token,
    # refresh token, expiry etc.)
    calendar_token = db.Column(db.JSON, nullable=True)

    # server_default means the database itself sets this value
    # automatically when a new row is created — you don't have to
    # pass it in your code.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationship() doesn't create a column — it's just a convenience
    # that lets you do user.plans to get all plans belonging to this user
    # instead of writing a separate query every time.

    # Update/Add these relationship lines inside your User class:
    plans = db.relationship('Plan', backref='organizer', lazy=True)
    availabilities = db.relationship('Availability', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

    # __repr__ is what Python prints when you do print(user) —
    # useful for debugging so you see something meaningful
    # instead of <User object at 0x...>
    def __repr__(self):
        return f'<User {self.email}>'