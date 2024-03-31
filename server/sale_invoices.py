from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Medication, Order, SaleInvoice
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
        'active_sale': fields.Boolean,
        'status': fields.String,
        'due_date': fields.Date,
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

            return jsonify({'message': 'Sale updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete a sale by id"""
        try:
            sale_to_delete = SaleInvoice.query.get_or_404(id)

            # Delete corresponding sale first
            order_to_delete = Order.query.filter_by(customer_order_id=sale_to_delete.id).first()
            if order_to_delete:
                order_to_delete.delete()

            # Update medication stock after ensuring consistency
            medication = Medication.query.get_or_404(order_to_delete.medication_id)
            medication.stock_quantity += order_to_delete.quantity
            medication.save()

            # Finally, delete the order
            order_to_delete.delete()

            return jsonify({'message': 'Order deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))
