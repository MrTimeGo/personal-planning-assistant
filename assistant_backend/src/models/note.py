from src.models.user import User
from sqlalchemy import ForeignKeyConstraint
from src.db.db import db
from datetime import datetime


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    content = db.Column(db.Text, nullable=False)

    __table_args__ = (
        ForeignKeyConstraint([user_id], [User.id]),
    )

    def __init__(self, user_id, name, content):
        self.user_id = user_id
        self.name = name
        self.content = content

    def __repr__(self):
        return f"<Note {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "content": self.content,
        }
