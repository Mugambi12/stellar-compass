# Path: server/run.py

from main import create_app
from config import DevelopmentConfig


if __name__ == '__main__':
    app = create_app(DevelopmentConfig)
    app.run()

#if __name__ == '__main__':
#    with app.app_context():
#        db.create_all()
#    app.run()
