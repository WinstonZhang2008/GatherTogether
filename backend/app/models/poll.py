from app import db
from datetime import datetime, timezone


def _utcnow():
    return datetime.now(timezone.utc)


class Poll(db.Model):
    __tablename__ = 'polls'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    is_closed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=_utcnow)

    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id', ondelete='CASCADE'), nullable=False)

    # one poll has many options; deleting the poll wipes its options and votes
    options = db.relationship('PollOption', backref='poll', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Poll {self.question}>'


class PollOption(db.Model):
    __tablename__ = 'poll_options'

    id = db.Column(db.Integer, primary_key=True)
    option_text = db.Column(db.String(255), nullable=False)

    poll_id = db.Column(db.Integer, db.ForeignKey('polls.id'), nullable=False)

    votes = db.relationship('Vote', backref='option', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<PollOption {self.option_text}>'


class Vote(db.Model):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=_utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('poll_options.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f'<Vote user:{self.user_id} option:{self.option_id}>'
