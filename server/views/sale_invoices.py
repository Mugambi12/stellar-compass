from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import  Payment, Medication, Order
from exts import db
from flask_jwt_extended import jwt_required

# Initialize Flask-RESTx Namespace for Sales
sale_invoice_ns = Namespace('sales', description='Sale Operations')

# Model for Sale Serializer
sale_model = sale_invoice_ns.model(
    'SaleInvoice', {
        'id': fields.Integer,
        'customer_order_id': fields.Integer,
        'amount': fields.Float,
        'payment_method': fields.String,
        'transaction_id': fields.String,
        'status': fields.String,
        'response_status': fields.String,
        'response_amount': fields.Float,
        'response_charge_response_code': fields.String,
        'response_charge_response_message': fields.String,
        'response_charged_amount': fields.Float,
        'response_currency': fields.String,
        'response_flw_ref': fields.String,
        'response_transaction_id': fields.String,
        'response_tx_ref': fields.String,
        'response_customer_email': fields.String,
        'response_customer_name': fields.String,
        'response_customer_phone_number': fields.String,

        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)


@sale_invoice_ns.route('/sales')
class SaleResource(Resource):

    @sale_invoice_ns.marshal_list_with(sale_model)
    def get(self):
        """Get all sales"""
        sales = Payment.query.all()
        return sales, 200
