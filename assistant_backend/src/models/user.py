from flask_login import UserMixin
from src.db.db import db


class User(UserMixin, db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    hash_password = db.Column(db.String, nullable=False)
    is_confirmed = db.Column(db.Boolean, nullable=False, default=False)
    calendar_id = db.Column(db.String, nullable=True)

    def __init__(self, email, password, is_confirmed=False):
        self.email = email
        self.hash_password = password
        self.is_confirmed = is_confirmed

    def __repr__(self):
        return f"<email {self.email}>"
