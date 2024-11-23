from flask import Blueprint

main = Blueprint('main', __name__)


@main.route('/')
def hello_world():  # put application's code here
    return "Hello, World!"
