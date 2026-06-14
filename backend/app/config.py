import os
from dotenv import load_dotenv

# load_dotenv() reads your .env file and makes all the variables
# inside it available via os.environ. without this line, Python
# has no idea your .env file exists.
load_dotenv()

class Config:
    # SECRET_KEY is used by Flask to sign cookies and sessions.
    # if someone tampers with a cookie, Flask will know because
    # the signature won't match. never hardcode this — always
    # pull it from .env so it stays out of your code/github.
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # this is the connection string to your database.
    # format is: postgresql://username:password@host/database_name
    # pulling from .env so your real database credentials are
    # never exposed in your code.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

    # SQLAlchemy has a feature that tracks every change to objects
    # and fires signals. you almost never need this and it uses
    # extra memory, so we turn it off.
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # this is the secret key used to sign your JWT tokens.
    # JWTs are what keep users logged in — when a user logs in,
    # your server creates a token signed with this key and sends
    # it to the frontend. the frontend sends it back with every
    # request to prove who they are.
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')