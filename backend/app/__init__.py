from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config

# these are created outside create_app() so that models can import
# db directly from this file. if they were inside the function,
# nothing else could access them.
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    # __name__ is a built-in Python variable that equals the name
    # of the current module. Flask uses it to locate resources
    # like templates and static files. never hardcode this.
    app = Flask(__name__)

    # loads all your settings from config.py (database URL,
    # secret keys, etc.) into the Flask app
    app.config.from_object(Config)

    # connects SQLAlchemy and JWTManager to THIS specific app
    # instance. we pass app in here rather than at creation time
    # because of the factory pattern — the extensions were created
    # without an app, now we bind them to one.
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # imported here (inside the function) to avoid circular imports.
    # if we imported at the top, routes would try to import db from
    # this file before this file finished loading — causing a crash.
    from app.routes import register_routes
    register_routes(app)

    return app