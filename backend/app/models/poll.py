from app import db
from datetime import datetime

class Poll(db.Model):
    __tablename__ = 'polls'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False) # e.g., "Where should we grab food?"
    
    # Stored as JSON: e.g., {"Taco Shop": 4, "Pizza Place": 2}
    options_and_votes = db.Column(db.JSON, nullable=False) 
    
    is_closed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # LINK: Connects this poll to its main plan page
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)

    def __repr__(self):
        return f'<Poll {self.question}>'