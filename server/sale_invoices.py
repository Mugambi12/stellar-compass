from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import SaleInvoice
from exts import db
from flask_jwt_extended import jwt_required

# Initialize Flask-RESTx Namespace for Sales
sale_invoice_ns = Namespace('sales', description='Sale Operations')

# Model for Sale Serializer
sale_model = sale_invoice_ns.model(
    'Sale', {
        'id': fields.Integer,
        'customer_order_id': fields.Integer,
        'amount': fields.Float,
        'payment_method': fields.String,
        'transaction_id': fields.String,
        'active_sale': fields.Boolean,
        'status': fields.String,
        'due_date': fields.Date,  # Add due date field for invoice due date
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)

# Resource for handling sales
@sale_invoice_ns.route('/sales')
class SaleResource(Resource):

    @sale_invoice_ns.marshal_list_with(sale_model)
    def get(self):
        """Get all sales"""
        sales = SaleInvoice.query.all()
        return sales, 200

    @sale_invoice_ns.expect(sale_model)
    @jwt_required()
    def post(self):
        """Create a new sale"""
        try:
            data = request.get_json()
            new_sale = SaleInvoice(**data)
            new_sale.save()

            # If active sale is true, generate invoice
            if data.get('active_sale', False):
                generate_invoice(new_sale)

            return jsonify({'message': 'Sale created successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

# Resource for handling individual sales
@sale_invoice_ns.route('/sales/<int:id>')
class SaleDetailResource(Resource):

    @sale_invoice_ns.marshal_with(sale_model)
    def get(self, id):
        """Get a sale by id"""
        sale = SaleInvoice.query.get_or_404(id)
        return sale, 200

    @sale_invoice_ns.expect(sale_model)
    @jwt_required()
    def put(self, id):
        """Update a sale by id"""
        try:
            data = request.get_json()
            sale_to_update = SaleInvoice.query.get_or_404(id)
            sale_to_update.update(**data)

            # If active sale is true and status is updated, generate invoice
            if data.get('active_sale', False) and data.get('status') != 'Pending':
                generate_invoice(sale_to_update, data.get('due_date'))  # Pass due date from request data
            elif data.get('status') == 'Pending':
                # If status is reverted to pending, delete the invoice
                delete_invoice(sale_to_update)

            db.session.commit()

            return jsonify({'message': 'Sale updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete a sale by id"""
        try:
            sale_to_delete = SaleInvoice.query.get_or_404(id)
            db.session.delete(sale_to_delete)
            db.session.commit()

            return jsonify({'message': 'Sale deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

# Function to generate or update invoice
def generate_invoice(sale, due_date=None):
    invoice_data = {
        'customer_order_id': sale.customer_order_id,
        'amount': sale.amount,
        'due_date': due_date,
        'status': 'Pending'  # Assuming initial status is pending
    }
    existing_invoice = SaleInvoice.query.filter_by(customer_order_id=sale.customer_order_id).first()
    if existing_invoice:
        existing_invoice.update(**invoice_data)  # Update existing invoice
    else:
        new_invoice = SaleInvoice(**invoice_data)
        new_invoice.save()  # Create new invoice

# Function to delete invoice
def delete_invoice(sale):
    existing_invoice = SaleInvoice.query.filter_by(customer_order_id=sale.customer_order_id).first()
    if existing_invoice:
        db.session.delete(existing_invoice)  # Delete existing invoice
