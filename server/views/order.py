from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Order, Medication, Payment, SaleInvoice
from exts import db
from flask_jwt_extended import jwt_required

# Initialize Flask-RESTx Namespace
order_ns = Namespace('orders', description='Order Operations')

# Model for Order Serializer
order_model = order_ns.model(
    'Order', {
        'user_id': fields.Integer(required=True),
        'medication_id': fields.Integer(required=True),
        'quantity': fields.Integer(required=True),
        'shipping': fields.String(required=True),
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

# Model for Payment Serializer
payment_model = order_ns.model(
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


@order_ns.route('/orders')
class OrderResource(Resource):

    @order_ns.marshal_list_with(order_model)
    def get(self):
        """Get all orders"""
        orders = Order.query.all()
        return orders, 200

    @order_ns.expect(order_model, payment_model)
    @jwt_required()
    def post(self):
        try:
            data = request.json
            user_id = data.get('user_id')
            medication_id = data.get('medication_id')
            quantity = data.get('quantity')
            shipping = data.get('shipping')

            medication = Medication.query.get_or_404(medication_id)
            if medication.stock_quantity < quantity:
                abort(400, message=f'Insufficient stock. There are only {medication.stock_quantity} units available')

            calculate_total_price = quantity * medication.price
            new_order = Order(user_id=user_id,
                              medication_id=medication_id,
                              quantity=quantity,
                              shipping=shipping,
                              total_price=calculate_total_price,
                              payment_status='Pending')
            new_order.save()

            sale_invoice = SaleInvoice(customer_order=new_order,
                                       amount=calculate_total_price,
                                       status='Pending')
            sale_invoice.save()

            if not data.get('response_transaction_id'):
                return jsonify({'message': 'Order placed successfully but payment to be made later.'}), 200

            payment = Payment(invoice=sale_invoice, amount=data.get('response_amount'),
                              payment_method=data.get('response_payment_method'),
                              transaction_id=data.get("response_transaction_id"),
                              status=data.get("response_status"),
                              response_amount=data.get("response_amount"),
                              response_charge_response_code=data.get("response_charge_response_code"),
                              response_charge_response_message=data.get("response_charge_response_message"),
                              response_charged_amount=data.get("response_charged_amount"),
                              response_currency=data.get("response_currency"),
                              response_flw_ref=data.get("response_flw_ref"),
                              response_transaction_id=data.get("response_transaction_id"),
                              response_tx_ref=data.get("response_tx_ref"),
                              response_customer_email=data.get("response_customer_email"),
                              response_customer_name=data.get("response_customer_name"),
                              response_customer_phone_number=data.get("response_customer_phone_number"))
            payment.save()

            return jsonify({'message': 'Order placed successfully and payment made'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500


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

        if order_to_delete.status != 'Approved':
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
