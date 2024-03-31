from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Order, Medication, Sale, Invoice, Payment
from exts import db
from flask_jwt_extended import jwt_required


# Initialize Flask-RESTx Namespace for Sales
sale_ns = Namespace('sales', description='Sale Operations')

# Model for Sale Serializer
sale_model = sale_ns.model(
    'Sale', {
        'id': fields.Integer,
        'customer_order_id': fields.Integer,
        'amount': fields.Float,
        'payment_method': fields.String,
        'transaction_id': fields.String,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)

# Resource for handling sales
@sale_ns.route('/sales')
class SaleResource(Resource):

    @sale_ns.marshal_list_with(sale_model)
    def get(self):
        """Get all sales"""
        sales = Sale.query.all()
        return sales, 200

    @sale_ns.expect(sale_model)
    @jwt_required()
    def post(self):
        """Create a new sale"""
        try:
            data = request.get_json()
            customer_order_id = data.get('customer_order_id')
            amount = data.get('amount')
            payment_method = data.get('payment_method')
            transaction_id = data.get('transaction_id')

            new_sale = Sale(**data)
            db.session.add(new_sale)
            db.session.commit()

            return jsonify({'message': 'Sale created successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

# Resource for handling individual sales
@sale_ns.route('/sales/<int:id>')
class SaleDetailResource(Resource):

    @sale_ns.marshal_with(sale_model)
    def get(self, id):
        """Get a sale by id"""
        sale = Sale.query.get_or_404(id)
        return sale, 200

    @sale_ns.expect(sale_model)
    @jwt_required()
    def put(self, id):
        """Update a sale by id"""
        try:
            data = request.get_json()
            sale_to_update = Sale.query.get_or_404(id)
            sale_to_update.update(**data)

            db.session.commit()

            return jsonify({'message': 'Sale updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete a sale by id"""
        try:
            sale_to_delete = Sale.query.get_or_404(id)
            db.session.delete(sale_to_delete)
            db.session.commit()

            return jsonify({'message': 'Sale deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

