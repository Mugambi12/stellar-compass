from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from config import DevelopmentConfig

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
api=Api(app, doc='/docs')

@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello world"}

if __name__ == '__main__':
    app.run()
