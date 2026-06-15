# this file is the central hub for all routes.
# instead of registering every blueprint in app/__init__.py,
# we do it all here and just call register_routes() from there.
# keeps app/__init__.py clean and organized.

from app.routes.auth import auth_bp
from app.routes.plans import plans_bp
from app.routes.polls import polls_bp
from app.routes.availability import availability_bp
from app.routes.notifications import notifications_bp

def register_routes(app):
    # url_prefix means every route in auth.py automatically
    # starts with /api/auth — so a route defined as /register
    # becomes /api/auth/register
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(plans_bp, url_prefix='/api/plans')
    app.register_blueprint(polls_bp, url_prefix='/api/polls')
    app.register_blueprint(availability_bp, url_prefix='/api/availability')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')