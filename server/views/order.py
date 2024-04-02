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
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            medication_id = data.get('medication_id')
            quantity = data.get('quantity')


            # Check medication availability
            medication = Medication.query.get_or_404(medication_id)
            if medication.stock_quantity < quantity:
                abort(400, message=f'Insufficient stock. There are only {medication.stock_quantity} units available')

            # Create order
            total_price = quantity * medication.price
            new_order = Order(**data, total_price=total_price)
            new_order.save()

            # Create corresponding sale
            new_sale = SaleInvoice(customer_order_id=new_order.id, amount=new_order.total_price)
            new_sale.save()

            # Update medication stock
            medication.stock_quantity -= quantity
            medication.save()

            return jsonify({'message': 'Order placed successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))


# Resource for handling individual orders
@order_ns.route('/order/<int:id>')
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
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            medication_id = data.get('medication_id')
            quantity = data.get('quantity')

            order_to_update = Order.query.get_or_404(id)

            # Check medication availability
            medication = Medication.query.get_or_404(medication_id)
            if medication.stock_quantity < quantity:
                abort(400, message=f'Insufficient stock. There are only {medication.stock_quantity} units available')

            total_price = quantity * medication.price

            # Adjust medication stock
            if order_to_update.quantity > quantity:
                medication.stock_quantity += order_to_update.quantity - quantity
            elif order_to_update.quantity < quantity:
                medication.stock_quantity -= quantity - order_to_update.quantity

            # Update order
            order_to_update.update(**data, total_price=total_price)

            # Update corresponding sale
            sale = SaleInvoice.query.filter_by(customer_order_id=order_to_update.id).first()
            if sale:
                sale.amount = total_price
                sale.save()

            return jsonify({'message': 'Order updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete an order by id"""
        try:
            order_to_delete = Order.query.get_or_404(id)

            # Delete corresponding sale first
            sale_to_delete = SaleInvoice.query.filter_by(customer_order_id=order_to_delete.id).first()
            if sale_to_delete:
                sale_to_delete.delete()

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
