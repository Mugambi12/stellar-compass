from flask import request, jsonify
from flask_restx import Resource, Namespace, fields
from models import Order, Medication
from flask_jwt_extended import jwt_required

# Initialize Flask-RESTx Namespace
order_ns = Namespace('orders', description='Order Operations')

# Model for Order Serializer
order_model = order_ns.model(
    'Order', {
        'id': fields.Integer,
        'user_id': fields.Integer,
        'medication_id': fields.Integer,
        'quantity': fields.Integer,
        'total_price': fields.Float,
        'payment_method': fields.String,
        'to_be_delivered': fields.Boolean,
        'delivery_address': fields.String,
        'delivery_status': fields.String,
        'delivery_date': fields.DateTime,
        'payment_status': fields.String,
        'is_online_order': fields.Boolean,
        'transaction_id': fields.String,
        'status': fields.String,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)

# Resource for handling orders
@order_ns.route('/orders')
class OrderResource(Resource):

    @order_ns.marshal_list_with(order_model)
    def get(self):
        """Get all orders"""
        orders = Order.query.all()
        return orders, 200

    @order_ns.expect(order_model)
    @jwt_required()
    def post(self):
        """Create a new order"""
        data = request.get_json()
        user_id = data.get('user_id')
        medication_id = data.get('medication_id')
        quantity = data.get('quantity')

        # Check medication availability
        medication = Medication.query.get_or_404(medication_id)
        if medication.stock_quantity < quantity:
            return jsonify({'message': 'Insufficient stock'})

        # Create order
        total_price = quantity * medication.price
        new_order = Order(**data, total_price=total_price)
        new_order.save()

        # Update medication stock
        medication.stock_quantity -= quantity
        medication.save()

        return jsonify({'message': 'Order placed successfully'})

# Resource for handling individual orders
@order_ns.route('/orders/<int:id>')
class OrderDetailResource(Resource):

    @order_ns.marshal_with(order_model)
    def get(self, id):
        """Get an order by id"""
        order = Order.query.get_or_404(id)
        return order, 200

    @order_ns.expect(order_model)
    @jwt_required()
    def put(self, id):
        """Update an order by id"""
        data = request.get_json()
        user_id = data.get('user_id')
        medication_id = data.get('medication_id')
        quantity = data.get('quantity')

        order_to_update = Order.query.get_or_404(id)

        # Check medication availability
        medication = Medication.query.get_or_404(medication_id)
        if medication.stock_quantity < quantity:
            return jsonify({'message': 'Insufficient stock'})

        total_price = quantity * medication.price
        order_to_update.update(**data, total_price=total_price)

        if order_to_update.quantity != quantity:
            # Update medication stock
            medication.stock_quantity += order_to_update.quantity
            medication.stock_quantity -= quantity
            medication.save()

        return jsonify({'message': 'Order updated successfully'})

    @jwt_required()
    def delete(self, id):
        """Delete an order by id"""
        order_to_delete = Order.query.get_or_404(id)
        order_to_delete.delete()

        # Update medication stock
        medication = Medication.query.get_or_404(id)
        quantity = order_to_delete.quantity
        medication.stock_quantity += quantity
        medication.save()
        return jsonify({'message': 'Order deleted successfully'})
