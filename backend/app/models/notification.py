from app import db
from datetime import datetime, timezone


def _utcnow():
    return datetime.now(timezone.utc)

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False) # e.g., "Alex invited you to Friday Tacos!"
    
    # Track if the user clicked it on their mobile phone screen yet
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=_utcnow)

    # LINKS: Connects to the receiver user and optional plan link
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=True) # Optional link

    def __repr__(self):
        return f'<Notification For User:{self.user_id}>'