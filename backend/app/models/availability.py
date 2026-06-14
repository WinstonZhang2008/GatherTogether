from app import db
from datetime import datetime

class Availability(db.Model):
    __tablename__ = 'availabilities'

    id = db.Column(db.Integer, primary_key=True)
    
    # Stored as raw datetimes or JSON blocks depending on calendar sync
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # LINKS: Connects this specific time block to BOTH a user and a plan
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)

    def __repr__(self):
        return f'<Availability User:{self.user_id} Plan:{self.plan_id}>'