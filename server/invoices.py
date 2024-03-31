from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Order, Medication, Payment
from exts import db
from flask_jwt_extended import jwt_required

# Initialize Flask-RESTx Namespace for Invoices
invoice_ns = Namespace('invoices', description='Invoice Operations')

# Model for Invoice Serializer
invoice_model = invoice_ns.model(
    'Invoice', {
        'id': fields.Integer,
        'sale_id': fields.Integer,
        'customer_order_id': fields.Integer,
        'amount': fields.Float,
        'status': fields.String,
        'due_date': fields.Date,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)

# Resource for handling invoices
@invoice_ns.route('/invoices')
class InvoiceResource(Resource):

    @invoice_ns.marshal_list_with(invoice_model)
    def get(self):
        """Get all invoices"""
        invoices = Invoice.query.all()
        return invoices, 200

    @invoice_ns.expect(invoice_model)
    @jwt_required()
    def post(self):
        """Create a new invoice"""
        try:
            data = request.get_json()
            new_invoice = Invoice(**data)
            db.session.add(new_invoice)
            db.session.commit()

            return jsonify({'message': 'Invoice created successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

# Resource for handling individual invoices
@invoice_ns.route('/invoice/<int:id>')
class InvoiceDetailResource(Resource):

    @invoice_ns.marshal_with(invoice_model)
    def get(self, id):
        """Get an invoice by id"""
        invoice = Invoice.query.get_or_404(id)
        return invoice, 200

    @invoice_ns.expect(invoice_model)
    @jwt_required()
    def put(self, id):
        """Update an invoice by id"""
        try:
            data = request.get_json()
            invoice_to_update = Invoice.query.get_or_404(id)
            invoice_to_update.update(**data)

            db.session.commit()

            return jsonify({'message': 'Invoice updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete an invoice by id"""
        try:
            invoice_to_delete = Invoice.query.get_or_404(id)
            db.session.delete(invoice_to_delete)
            db.session.commit()

            return jsonify({'message': 'Invoice deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

