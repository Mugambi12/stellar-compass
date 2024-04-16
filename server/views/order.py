from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from flask_jwt_extended import jwt_required
from models import db, Order, Medication, Payment

order_ns = Namespace('orders', description='Order Operations')

order_model = order_ns.model(
    'Order', {
        'id': fields.Integer,
        'user_id': fields.Integer,
        'medication_id': fields.Integer,
        'quantity': fields.Integer,
        'status': fields.String,
        'payment_status': fields.String,
        'sold': fields.Boolean,
        'shipping': fields.String,
        'shipping_method': fields.String,
        'shipping_address': fields.String,
        'shipping_status': fields.String,
        'shipping_tracking_number': fields.String,
        'shipping_carrier': fields.String,
        'shipping_cost': fields.Float,
        'total_price': fields.Float,
        'deleted': fields.Boolean,
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
        quantity = int(data['quantity'])

        medication = Medication.query.get(data['medication_id'])

        if medication.stock_quantity < quantity:
            abort(400, message=f"Insufficient stock quantity available. We only have {medication.stock_quantity} left.")

        total_price = medication.price * quantity

        medication.stock_quantity -= quantity
        db.session.add(medication)

        new_order = Order(
            user_id=data['user_id'],
            medication_id=data['medication_id'],
            quantity=quantity,
            shipping=data['shipping'],
            total_price=total_price,
            payment_status='Pending',
            status='Approved',
            sold=False
        )
        new_order.save()

        return jsonify({"message": "Order created successfully"})


@order_ns.route('/orders/<int:id>')
class OrderResourceByID(Resource):

    @order_ns.marshal_with(order_model)
    def get(self, id):
        """Get a order by id"""
        order = Order.query.get_or_404(id)
        return order, 200

    @order_ns.expect(order_model)
    @jwt_required()
    def put(self, id):
        """Update a order by id"""
        order_to_update = Order.query.get_or_404(id)
        data = request.get_json()
        order_to_update.update(**data)

        return jsonify({"message": "Order updated successfully"})

    @order_ns.expect(order_model)
    @jwt_required()
    def delete(self, id):
        """Delete a order by id"""
        order_to_delete = Order.query.get_or_404(id)
        order_to_delete.delete()
        return jsonify({"message": "Order deleted successfully"})

#    def delete(self, id):
#        """Delete an order by id"""
#        order_to_delete = Order.query.get_or_404(id)
#
#        payments_to_delete = Payment.query.filter_by(customer_order_id=id).all()
#        for payment in payments_to_delete:
#            payment.delete()
#
#        order_to_delete.delete()
#        return jsonify({"message": "Order and associated payments deleted successfully"})

