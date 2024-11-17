import random

from src.db.db import db
from src.models.verification_code import VerificationCode


def get_verification_code_by_user_id(user_id):
    return VerificationCode.query.filter_by(user_id=user_id).first()


def new_verification_code(user_id):
    verification_code = get_verification_code_by_user_id(user_id)
    if verification_code:
        verification_code.code = generate_code()
    else:
        verification_code = VerificationCode(user_id=user_id, code=generate_code())
        db.session.add(verification_code)

    db.session.commit()

    return verification_code


def generate_code():
    return random.randint(100000, 999999)
