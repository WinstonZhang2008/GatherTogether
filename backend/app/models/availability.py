from app import db
from datetime import datetime, timezone


def _utcnow():
    return datetime.now(timezone.utc)


class Availability(db.Model):
    __tablename__ = 'availabilities'

    id = db.Column(db.Integer, primary_key=True)

    # JSON array of time slot objects, e.g. [{"day": "Mon", "hour": "18:00"}, ...]
    # matches the tap-grid the AvailabilityScreen sends
    available_slots = db.Column(db.JSON, nullable=False)

    created_at = db.Column(db.DateTime, default=_utcnow)
    # updated whenever the user re-submits their grid selection
    updated_at = db.Column(db.DateTime, default=_utcnow, onupdate=_utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)

    def __repr__(self):
        return f'<Availability user:{self.user_id} plan:{self.plan_id}>'
