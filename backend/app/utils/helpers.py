from app import db
from app.models.notification import Notification


def create_notification(user_id: int, message: str, plan_id: int | None = None) -> Notification:
    """
    Create and persist a notification for a user.

    Call this from any route that needs to alert a user, e.g.:
        create_notification(user_id=member.id, message="Alex locked in Saturday 7 pm!", plan_id=plan.id)

    Returns the saved Notification so the caller can inspect its id if needed.
    """
    notif = Notification()
    notif.user_id = user_id
    notif.message = message
    notif.plan_id = plan_id
    notif.is_read = False
    db.session.add(notif)
    # intentionally no commit here — caller controls the transaction boundary
    return notif
