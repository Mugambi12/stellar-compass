from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Order, Medication, SaleInvoice
from exts import db
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
        'payment_status': fields.String,
        'order_type': fields.Boolean,
        'status': fields.String,
        'sold': fields.Boolean,
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


        medication = Medication.query.get_or_404(medication_id)
        if medication.stock_quantity < quantity:
            abort(400, message=f'Insufficient stock. There are only {medication.stock_quantity} units available')

        total_price = quantity * medication.price
        new_order = Order(**data, total_price=total_price)
        new_order.save()

        new_sale = SaleInvoice(customer_order_id=new_order.id, amount=new_order.total_price)
        new_sale.save()

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
        data = request.get_json()
        medication_id = data.get('medication_id')
        quantity = data.get('quantity')

        order_to_update = Order.query.get_or_404(id)

        old_medication_id = order_to_update.medication_id
        old_medication = Medication.query.get_or_404(old_medication_id)

        if medication_id == old_medication_id:
            if quantity != order_to_update.quantity:
                old_medication.stock_quantity += order_to_update.quantity - quantity
                old_medication.save()
        else:
            old_medication.stock_quantity += order_to_update.quantity
            old_medication.save()

            new_medication = Medication.query.get_or_404(medication_id)
            if new_medication.stock_quantity < quantity:
                abort(400, message=f'Insufficient stock for the new medication. There are only {new_medication.stock_quantity} units available')

            new_medication.stock_quantity -= quantity
            new_medication.save()

        total_price = quantity * new_medication.price if medication_id != old_medication_id else quantity * old_medication.price

        order_to_update.update(**data, total_price=total_price)

        sale = SaleInvoice.query.filter_by(customer_order_id=order_to_update.id).first()
        if sale:
            sale.amount = total_price
            sale.save()

        return jsonify({'message': 'Order updated successfully'})

    @jwt_required()
    def delete(self, id):
        """Delete an order by id"""
        order_to_delete = Order.query.get_or_404(id)

        if not order_to_delete:
            abort(404, message='Order not found')

        if order_to_delete.status != 'Confirmed':
            abort(400, message='Cannot delete a sold order')

        sale_to_delete = SaleInvoice.query.filter_by(customer_order_id=order_to_delete.id).first()
        if sale_to_delete:
            sale_to_delete.delete()
            abort(400, message='Order associated sale invoice sold. Cannot delete order')

        medication = Medication.query.get_or_404(order_to_delete.medication_id)
        medication.stock_quantity += order_to_delete.quantity
        medication.save()

        order_to_delete.delete()

        return jsonify({'message': 'Order deleted successfully'})
