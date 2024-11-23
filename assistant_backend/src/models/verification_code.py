from src.db.db import db
from src.models.user import User
from sqlalchemy import ForeignKeyConstraint


class VerificationCode(db.Model):
    __tablename__ = "verification_codes"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        ForeignKeyConstraint([user_id], [User.id]),
    )

    def __init__(self, code, user_id):
        self.code = code
        self.user_id = user_id

    def __repr__(self):
        return f"<code {self.code}>"
