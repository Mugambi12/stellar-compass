from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Order, Medication, SaleInvoice, Payment
from exts import db
from flask_jwt_extended import jwt_required

# Initialize Flask-RESTx Namespace for Payments
payment_ns = Namespace('payments', description='Payment Operations')

# Model for Payment Serializer
payment_model = payment_ns.model(
    'Payment', {
        'invoice_id': fields.Integer,
        'amount': fields.Float,
        'payment_method': fields.String,
        'transaction_id': fields.String,
        'status': fields.String,
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

# Resource for handling payments
@payment_ns.route('/payments')
class PaymentResource(Resource):

    @payment_ns.marshal_list_with(payment_model)
    def get(self):
        """Get all payments"""
        payments = Payment.query.all()
        return payments, 200

    @payment_ns.expect(payment_model)
    @jwt_required()
    def post(self):
        """Create a new payment"""
        try:
            data = request.get_json()
            new_payment = Payment(**data)
            new_payment.save()
            return jsonify({'message': 'Payment created successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

# Resource for handling individual payments
@payment_ns.route('/payments/<int:id>')
class PaymentDetailResource(Resource):

    @payment_ns.marshal_with(payment_model)
    def get(self, id):
        """Get a payment by id"""
        payment = Payment.query.get_or_404(id)
        return payment, 200

    @payment_ns.expect(payment_model)
    @jwt_required()
    def put(self, id):
        """Update a payment by id"""
        try:
            data = request.get_json()
            payment_to_update = Payment.query.get_or_404(id)
            payment_to_update.update(**data)
            return jsonify({'message': 'Payment updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete a payment by id"""
        try:
            payment_to_delete = Payment.query.get_or_404(id)
            payment_to_delete.delete()
            return jsonify({'message': 'Payment deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

