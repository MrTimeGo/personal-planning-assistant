from flask import Blueprint, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_required, login_user, logout_user, current_user
from flask import redirect, url_for, current_app

from src.repositories.user import create_user, get_user_by_email, mark_user_as_confirmed
from src.repositories.verification_code import new_verification_code, get_verification_code_by_user_id
from src.mailer import send_verification_code

from functools import wraps


def login_verify_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return current_app.login_manager.unauthorized()

        if not current_user.is_confirmed:
            flash("You need your email to be verified to access this page.", "warning")
            return redirect(url_for('login'))

        return login_required(f)(*args, **kwargs)

    return decorated_function


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

    if current_app.config['VERIFICATION_REQUIRED']:
        verification_code = new_verification_code(new_user.id)
        send_verification_code(new_user.email, verification_code.code)

    return 'Success', 201


@auth.route('/verify', methods=["POST"])
def verify():
    # TODO: PROPER PARSE & VALIDATION & RESPONSE
    email = request.json.get('email')
    code = request.json.get('code')

    user = get_user_by_email(email)
    if not user:
        return 'User does not exist', 404
    if user.is_confirmed:
        return 'User already confirmed', 409

    if current_app.config['VERIFICATION_REQUIRED']:
        verification_code = get_verification_code_by_user_id(user.id)
        if not verification_code or verification_code.code != code:
            return 'Invalid verification code', 400

    mark_user_as_confirmed(user)
    login_user(user, remember=True)

    return 'Success', 200


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


@auth.route('/profile', methods=["GET"])
@login_verify_required
def profile():
    return "Hello " + current_user.email


@auth.route('/logout', methods=["POST"])
@login_required
def logout():
    logout_user()
    return 'Success', 200


