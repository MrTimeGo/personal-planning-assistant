from decouple import config

from flask import Flask
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS

from .auth import auth as auth_blueprint
from .recognizer import recognizer as recognizer_blueprint
from .events import events as events_blueprint
from .notes import notes as notes_blueprint

from src.db.db import db
from src.repositories.user import get_user_by_id

app = Flask(__name__)
cors = CORS(app, supports_credentials=True, allow_headers="*")

app.config.from_object(config("APP_SETTINGS"))

app.register_blueprint(auth_blueprint)
app.register_blueprint(recognizer_blueprint)
app.register_blueprint(events_blueprint)
app.register_blueprint(notes_blueprint)

db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return get_user_by_id(user_id)


