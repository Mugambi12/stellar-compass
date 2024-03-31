from flask import request, jsonify
from flask_restx import Resource, Namespace, fields
from models import User

user_ns = Namespace('users', description='User Operations')


# Model for User Serializer
user_model = user_ns.model(
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


@user_ns.route('/users')
class UserResource(Resource):

    @user_ns.marshal_with(user_model)
    def get(self):
        """Get all users"""
        users = User.query.all()
        return users, 200

    @user_ns.marshal_with(user_model)
    def post(self):
        """Create a new user"""
        data = request.get_json()
        new_user = User(**data)
        new_user.save()
        return new_user, 201


@user_ns.route('/users/<int:id>')
class UserResource(Resource):

    @user_ns.marshal_with(user_model)
    def get(self, id):
        """Get a users by id"""
        user = User.query.get_or_404(id)
        return user, 200

    @user_ns.marshal_with(user_model)
    def put(self, id):
        """Update a users by id"""
        user_to_update = User.query.get_or_404(id)
        data = request.get_json()
        user_to_update.update(**data)

        return user_to_update, 200

    @user_ns.marshal_with(user_model)
    def delete(self, id):
        """Delete a users by id"""
        user_to_delete = User.query.get_or_404(id)
        user_to_delete.delete()
        return user_to_delete, 200

