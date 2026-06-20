# importing all models here serves two purposes:
# 1. lets you do "from app.models import User, Plan" anywhere in the app
# 2. ensures SQLAlchemy knows about all models when it creates the tables —
#    if a model isn't imported somewhere before db.create_all() runs,
#    SQLAlchemy won't know it exists and won't create its table.

from app.models.user import User
from app.models.plan import Plan
from app.models.poll import Poll, PollOption, Vote
from app.models.availability import Availability
from app.models.notification import Notification

__all__ = ['User', 'Plan', 'Poll', 'PollOption', 'Vote', 'Availability', 'Notification']
