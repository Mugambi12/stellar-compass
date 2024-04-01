from flask import request, jsonify, make_response
from flask_restx import Resource, Namespace, fields
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_ns = Namespace('auth', description='Authentication Operations')

# Model for Signup Serializer
signup_model = auth_ns.model(
    'Signup', {
        'username': fields.String,
        'email': fields.String,
        'password': fields.String,
        'address': fields.String,
        'contact_info': fields.String
    }
)

# Model for Login Serializer
login_model = auth_ns.model(
    'Login', {
        'username': fields.String,
        'password': fields.String
    }
)


@auth_ns.route('/signup')
class SignupResource(Resource):

    @auth_ns.expect(signup_model)
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
        return jsonify({"message": "You have successfully created an account. You can now login to your account."})


@auth_ns.route('/login')
class LoginResource(Resource):

    @auth_ns.expect(login_model)
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
        else:
            return jsonify({"message": "Login failed. Please check your credentials."})

@auth_ns.route('/refresh')
class RefreshTokenResource(Resource):

    @jwt_required(refresh=True)
    def post(self):
        """Refresh access token"""
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return make_response(jsonify({'access_token': access_token}), 200)
