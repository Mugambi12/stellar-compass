from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from config import DevelopmentConfig
from exts import db
from models import User, Medication, Order, Statement

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

db.init_app(app)

api=Api(app, doc='/docs')

# Model for User Serializer
user_model = api.model(
    'User', {
        'username': fields.String,
        'email': fields.String,
        'password': fields.String
    }
)

# Model for Medication Serializer
medication_model = api.model(
    'Medication', {
        'name': fields.String,
        'description': fields.String,
        'price': fields.Float,
        'stock_quantity': fields.Integer
    }
)


@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello world"}


@api.route('/users')
class UserResource(Resource):
    @api.expect(user_model)
    def post(self):
        """Create a new user"""
        data = request.json
        new_user = User(**data)
        new_user.save()
        return {"message": "User created successfully"}

    def get(self):
        """Get all users"""
        users = User.query.all()
        return jsonify(users)


@api.route('/medications')
class MedicationResource(Resource):
    @api.marshal_with(medication_model)

    @api.expect(medication_model)
    def post(self):
        """Create a new medication"""
        data = request.get_json()
        new_medication = Medication(**data)
        new_medication.save()
        return {"message": "Medication created successfully"}

    def get(self):
        """Get all medications"""
        medications = Medication.query.all()
        return jsonify(medications)

@api.route('/medications/<int:id>')
class MedicationResource(Resource):
    def get(self, id):
        """Get a medication by id"""
        medication = Medication.query.get(id)
        return jsonify(medication)

    def put(self, id):
        """Update a medication by id"""
        medication = Medication.query.get(id)
        data = request.json
        medication.update(**data)
        return {"message": "Medication updated successfully"}

    def delete(self, id):
        """Delete a medication by id"""
        medication = Medication.query.get(id)
        medication.delete()
        return {"message": "Medication deleted successfully"}


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
