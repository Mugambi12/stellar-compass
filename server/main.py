# Path: server/main.py

from flask import Flask
from flask_restx import Api
from exts import db
from models import *
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from views.auth import auth_ns
from views.users import user_ns
from views.medications import medicine_ns
from views.order import order_ns
from views.payments import payment_ns
from views.sale_invoices import sale_invoice_ns
from flask_cors import CORS

migrate = Migrate()
jwt = JWTManager()
#api = Api()

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    #api.init_app(app, doc='/docs')
    api=Api(app, doc='/docs')

    api.add_namespace(auth_ns)
    api.add_namespace(user_ns)
    api.add_namespace(medicine_ns)
    api.add_namespace(order_ns)
    api.add_namespace(payment_ns)
    api.add_namespace(sale_invoice_ns)

    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db,
            'User': User,
            'Medication': Medication,
            'Order': Order,
            'Payment': Payment
        }

    return app
