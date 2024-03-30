# Path: server/main.py

from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from config import DevelopmentConfig
from exts import db
from models import User, Medication, Order, Statement
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity


app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

db.init_app(app)
Migrate = Migrate(app, db)
JWTManager(app)
api=Api(app, doc='/docs')

# Model for User Serializer
user_model = api.model(
    'User', {
        'id': fields.Integer,
        'username': fields.String,
        'email': fields.String,
        'password': fields.String,
        'name': fields.String,
        'address': fields.String,
        'contact_info': fields.String,
        'role': fields.String,
        'is_active': fields.Boolean,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime
    }
)

# Model for Medication Serializer
medication_model = api.model(
    'Medication', {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'dosage': fields.String,
        'manufacturer': fields.String,
        'expiry_date': fields.Date,
        'category': fields.String,
        'price': fields.Float,
        'stock_quantity': fields.Integer,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime
    }
)

# Model for Signup Serializer
signup_model = api.model(
    'Signup', {
        'username': fields.String,
        'email': fields.String,
        'password': fields.String,
        'address': fields.String,
        'contact_info': fields.String,
        'role': fields.String
    }
)

# Model for Login Serializer
login_model = api.model(
    'Login', {
        'username': fields.String,
        'password': fields.String
    }
)


@api.route('/signup')
class SignupResource(Resource):

    @api.expect(signup_model)
    def post(self):
        """Create a new user"""
        data = request.get_json()

        username_exists = User.query.filter_by(username=data['username'], email=data['email']).first()
        if username_exists:
            return jsonify({"message": f"Username {data['username']} already exists"})

        password_hash = generate_password_hash(data['password'])
        data['password'] = password_hash

        new_user = User(**data)
        new_user.save()
        return jsonify({"message": "User created successfully"})

@api.route('/login')
class LoginResource(Resource):

    @api.expect(login_model)
    def post(self):
        """Login a user"""
        data = request.get_json()

        username_exists = User.query.filter_by(username=data['username']).first()

        if username_exists and check_password_hash(username_exists.password, data['password']):
            access_token = create_access_token(identity=username_exists.username)
            refresh_token = create_refresh_token(identity=username_exists.username)
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'refresh_token': refresh_token
            })



@api.route('/users')
class UserResource(Resource):

    @api.marshal_with(user_model)
    def get(self):
        """Get all users"""
        users = User.query.all()
        return users, 200

    @api.marshal_with(user_model)
    def post(self):
        """Create a new user"""
        data = request.get_json()
        new_user = User(**data)
        new_user.save()
        return new_user, 201


@api.route('/users/<int:id>')
class UserResource(Resource):

    @api.marshal_with(user_model)
    def get(self, id):
        """Get a users by id"""
        user = User.query.get_or_404(id)
        return user, 200

    @api.marshal_with(user_model)
    def put(self, id):
        """Update a users by id"""
        user_to_update = User.query.get_or_404(id)
        data = request.get_json()
        user_to_update.update(**data)

        return user_to_update, 200

    @api.marshal_with(user_model)
    def delete(self, id):
        """Delete a users by id"""
        user_to_delete = User.query.get_or_404(id)
        user_to_delete.delete()
        return user_to_delete, 200


@api.route('/medications')
class MedicationResource(Resource):

    @api.marshal_list_with(medication_model)
    def get(self):
        """Get all medications"""
        medications = Medication.query.all()
        return medications, 200

    @api.marshal_with(medication_model)
    @api.expect(medication_model)
    @jwt_required()
    def post(self):
        """Create a new medication"""
        data = request.get_json()
        new_medication = Medication(**data)
        new_medication.save()
        return new_medication, 201


@api.route('/medications/<int:id>')
class MedicationResource(Resource):

    @api.marshal_with(medication_model)
    def get(self, id):
        """Get a medication by id"""
        medication = Medication.query.get_or_404(id)
        return medication, 200

    @api.marshal_with(medication_model)
    @jwt_required()
    def put(self, id):
        """Update a medication by id"""
        medication_to_update = Medication.query.get_or_404(id)
        data = request.get_json()
        medication_to_update.update(**data)

        return medication_to_update, 200

    @api.marshal_with(medication_model)
    @jwt_required()
    def delete(self, id):
        """Delete a medication by id"""
        medication_to_delete = Medication.query.get_or_404(id)
        medication_to_delete.delete()
        return medication_to_delete, 200


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
    with app.app_context():
        db.create_all()
    app.run()
