from flask import Blueprint, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_required, login_user, logout_user, current_user

from src.repositories.user import create_user, get_user_by_email
from src.repositories.verification_code import new_verification_code
from src.mailer import send_verification_code

from decouple import config

auth = Blueprint('auth', __name__)


@auth.route('/signup', methods=["POST"])
def signup():
    # TODO: PROPER PARSE & VALIDATION & RESPONSE
    email = request.json.get('email')
    password = request.json.get('password')

    user = get_user_by_email(email)
    if user:
        return 'User already exists', 409

    new_user = create_user(email, generate_password_hash(password))

    verification_code = new_verification_code(new_user.id)
    send_verification_code(new_user.email, verification_code.code)

    return 'Success', 201


@auth.route('/login', methods=["POST"])
def login():
    # TODO: PROPER PARSE & VALIDATION & RESPONSE
    email = request.json.get('email')
    password = request.json.get('password')

    user = get_user_by_email(email)
    if not user or not check_password_hash(user.hash_password, password):
        return 'Please check your login details and try again.', 400

    login_user(user, remember=True)

    return 'Success', 200


@auth.route('/profile', methods=["POST"])
@login_required
def profile():
    return "Hello " + current_user.email


@auth.route('/logout', methods=["POST"])
@login_required
def logout():
    logout_user()
    return 'Success', 200
