from app import create_app, db

app = create_app()

# this creates all tables that don't exist yet based on your models.
# we'll remove this once everything is set up.
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)