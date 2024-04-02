# Path: server/config.py

from decouple import config

class Config:
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = config('DEVELOPMENT_DATABASE_URI')
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = config('PRODUCTION_DATABASE_URI')
    DEBUG = False
    SQLALCHEMY_ECHO = False

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = config('TEST_DATABASE_URI')
    SQLALCHEMY_ECHO = False
    TESTING = True

