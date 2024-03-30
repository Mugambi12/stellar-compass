from flask import Flask, request, jsonify
from flask_restx import Resource, Namespace, fields
from models import Order, Medication, User, Prescription
from flask_jwt_extended import jwt_required

order_ns = Namespace('orders', description='Order Operations')

# Model for Order Serializer
order_model = order_ns.model(
    'Order', {
        'id': fields.Integer,
        'user_id': fields.Integer,
        'medication_id': fields.Integer,
        'quantity': fields.Integer,
        'total_price': fields.Float,
        'order_status': fields.String,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)

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

        ## Create prescription
        #prescription = Prescription(
        #    user_id=user_id,
        #    medication_id=medication_id,
        #    quantity=quantity
        #)
        #prescription.save()

        # Create order
        total_price = quantity * medication.price
        new_order = Order(
            user_id=user_id,
            medication_id=medication_id,
            quantity=quantity,
            total_price=total_price,
            status='Pending'
        )
        new_order.save()

        # Update medication stock
        medication.stock_quantity -= quantity
        medication.save()

        return jsonify({'message': 'Order placed successfully'})

@order_ns.route('/orders/<int:id>')
class OrderResource(Resource):

    @order_ns.marshal_with(order_model)
    def get(self, id):
        """Get an order by id"""
        order = Order.query.get_or_404(id)
        return order, 200

    @order_ns.expect(order_model)
    @jwt_required()
    def put(self, id):
        """Update an order by id"""
        order_to_update = Order.query.get_or_404(id)
        data = request.get_json()
        order_to_update.update(**data)
        return order_to_update, 200

    @order_ns.marshal_with(order_model)
    @jwt_required()
    def delete(self, id):
        """Delete an order by id"""
        order_to_delete = Order.query.get_or_404(id)
        order_to_delete.delete()
        return None, 204
