from app import db
from datetime import datetime, timezone


def _utcnow():
    return datetime.now(timezone.utc)


class Plan(db.Model):
    __tablename__ = 'plans'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)

    # vibe/category the organizer picks when creating the plan (dinner, hike, movie, party, etc.)
    category = db.Column(db.String(50), nullable=True)

    # rough date window the group is targeting; filled at creation
    date_range_start = db.Column(db.DateTime, nullable=True)
    date_range_end = db.Column(db.DateTime, nullable=True)

    # final locked-in time after availability voting
    final_start_time = db.Column(db.DateTime, nullable=True)
    final_end_time = db.Column(db.DateTime, nullable=True)

    # draft → voting → confirmed → past
    status = db.Column(db.String(50), default='draft')

    created_at = db.Column(db.DateTime, default=_utcnow)

    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    availabilities = db.relationship('Availability', backref='plan', lazy=True, cascade='all, delete-orphan')
    polls = db.relationship('Poll', backref='plan', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='plan', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Plan {self.title}>'
