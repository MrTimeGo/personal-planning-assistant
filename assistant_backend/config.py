from decouple import config

DATABASE_URI = config("DATABASE_URL")
if DATABASE_URI.startswith("postgres://"):
    DATABASE_URI = DATABASE_URI.replace("postgres://", "postgresql://", 1)


class Config(object):
    SECRET_KEY = config("SECRET_KEY", default="guess-me")

    SQLALCHEMY_DATABASE_URI = DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_DEFAULT_SENDER = config("MAIL_DEFAULT_SENDER")
    MAIL_USERNAME = config("EMAIL_USER")
    MAIL_PASSWORD = config("EMAIL_PASSWORD")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
