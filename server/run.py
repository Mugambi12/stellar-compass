# Path: server/run.py

from main import create_app, db
from config import DevelopmentConfig, ProductionConfig


if __name__ == '__main__':
    app = create_app(DevelopmentConfig)
    with app.app_context():
        db.create_all()
    app.run()
