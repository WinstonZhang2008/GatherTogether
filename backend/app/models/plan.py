from app import db
from datetime import datetime

class Plan(db.Model):
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    
    # Final dates chosen by the group logic
    final_start_time = db.Column(db.DateTime, nullable=True)
    final_end_time = db.Column(db.DateTime, nullable=True)
    
    status = db.Column(db.String(50), default="planning") # e.g., planning, finalized, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # FOREIGN KEY: Links this plan to the User who created it
    # 'users.id' matches the __tablename__ = 'users' and its id column
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # RELATIONSHIPS: Makes pulling sub-data incredibly easy
    availabilities = db.relationship('Availability', backref='plan', lazy=True, cascade="all, delete-orphan")
    polls = db.relationship('Poll', backref='plan', lazy=True, cascade="all, delete-orphan")
    notifications = db.relationship('Notification', backref='plan', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Plan {self.title}>'