from src.db.db import db
from src.models.user import User


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def get_user_by_id(id):
    return User.query.filter_by(id=id).first()


def create_user(user):
    db.session.add(user)
    db.session.commit()

    return user
