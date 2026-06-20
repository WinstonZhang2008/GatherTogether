from app.routes.auth import auth_bp
from app.routes.plans import plans_bp
from app.routes.polls import polls_bp
from app.routes.availability import availability_bp
from app.routes.notifications import notifications_bp


def register_routes(app):
    # url_prefix is kept short (no /api) to match the vanilla-JS frontend's fetch calls:
    #   api.js: fetch('/auth/login'), fetch('/plans'), etc.
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(plans_bp, url_prefix='/plans')
    app.register_blueprint(polls_bp, url_prefix='/polls')
    app.register_blueprint(availability_bp, url_prefix='/availability')
    app.register_blueprint(notifications_bp, url_prefix='/notifications')
