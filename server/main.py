from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from config import DevelopmentConfig
from models import *
from exts import db

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

db.init_app(app)

api=Api(app, doc='/docs')


@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello world"}


@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Medication': Medication,
        'Order': Order,
        'Statement': Statement
    }

if __name__ == '__main__':
    app.run()
