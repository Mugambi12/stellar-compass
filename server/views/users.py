from flask import request, jsonify
from flask_restx import Resource, Namespace, fields
from models import User
from werkzeug.security import generate_password_hash, check_password_hash

user_ns = Namespace('users', description='User Operations')


# Model for User Serializer
user_model = user_ns.model(
    'User', {
        'id': fields.Integer,
        'name': fields.String,
        'username': fields.String,
        'email': fields.String,
        'password': fields.String,
        'address': fields.String,
        'contact_info': fields.String,
        'role': fields.String,
        'is_active': fields.Boolean,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime
    }
)


@user_ns.route('/hello')
class HelloWorld(Resource):
    def get(self):
        return {'message': 'Hello Eng. Trassy Karembo!'}


@user_ns.route('/users')
class UserResource(Resource):

    @user_ns.marshal_with(user_model)
    def get(self):
        """Get all users"""
        users = User.query.all()
        for user in users:
            user.password = '********'
        return users, 200

    @user_ns.expect(user_model)
    @user_ns.marshal_with(user_model)
    def post(self):
        """Create a new user"""
        data = request.get_json()
        hashed_password = generate_password_hash(data['password'])
        data['password'] = hashed_password
        new_user = User(**data)
        new_user.save()
        return new_user, 201


@user_ns.route('/users/<int:id>')
class UserResource(Resource):

    @user_ns.marshal_with(user_model)
    def get(self, id):
        """Get a users by id"""
        user = User.query.get_or_404(id)
        user.password = '********'
        return user, 200

    @user_ns.marshal_with(user_model)
    def put(self, id):
        """Update a user by id"""
        user_to_update = User.query.get_or_404(id)
        data = request.get_json()

        if 'password' in data and data['password'] != '********':
            hashed_password = generate_password_hash(data['password'])
            data['password'] = hashed_password
        else:
            data.pop('password', None)

        user_to_update.update(**data)

        return user_to_update, 200



    @user_ns.marshal_with(user_model)
    def delete(self, id):
        """Delete a users by id"""
        user_to_delete = User.query.get_or_404(id)
        user_to_delete.delete()
        return user_to_delete, 200

