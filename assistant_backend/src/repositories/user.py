from src.db.db import db
from src.models.user import User


def update_user_calendar(user_id, calendar_id):
    user = User.query.filter_by(id=user_id).first()
    user.calendar_id = calendar_id
    db.session.commit()


def get_user_by_email(email) -> User:
    return User.query.filter_by(email=email).first()


def get_user_by_id(id):
    return User.query.filter_by(id=id).first()


def mark_user_as_confirmed(user):
    user.is_confirmed = True
    db.session.commit()


def create_user(email, password):
    user = User(email, password)

    db.session.add(user)
    db.session.commit()

    return user
