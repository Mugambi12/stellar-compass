from flask import request, jsonify
from flask_restx import Resource, Namespace, fields, abort
from models import Order, Medication, Sale, Invoice, Payment
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

            return jsonify({'message': 'Order updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete an order by id"""
        try:
            order_to_delete = Order.query.get_or_404(id)
            quantity = order_to_delete.quantity

            # Update medication stock
            medication = Medication.query.get_or_404(order_to_delete.medication_id)
            medication.stock_quantity(quantity)

            # Delete order
            order_to_delete.delete()

            return jsonify({'message': 'Order deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))


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
@invoice_ns.route('/invoices/<int:id>')
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


# Initialize Flask-RESTx Namespace for Payments
payment_ns = Namespace('payments', description='Payment Operations')

# Model for Payment Serializer
payment_model = payment_ns.model(
    'Payment', {
        'id': fields.Integer,
        'invoice_id': fields.Integer,
        'amount': fields.Float,
        'payment_method': fields.String,
        'transaction_id': fields.String,
        'status': fields.String,
        'deleted': fields.Boolean,
        'created_at': fields.DateTime,
        'updated_at': fields.DateTime,
    }
)

# Resource for handling payments
@payment_ns.route('/payments')
class PaymentResource(Resource):

    @payment_ns.marshal_list_with(payment_model)
    def get(self):
        """Get all payments"""
        payments = Payment.query.all()
        return payments, 200

    @payment_ns.expect(payment_model)
    @jwt_required()
    def post(self):
        """Create a new payment"""
        try:
            data = request.get_json()
            new_payment = Payment(**data)
            db.session.add(new_payment)
            db.session.commit()

            return jsonify({'message': 'Payment created successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

# Resource for handling individual payments
@payment_ns.route('/payments/<int:id>')
class PaymentDetailResource(Resource):

    @payment_ns.marshal_with(payment_model)
    def get(self, id):
        """Get a payment by id"""
        payment = Payment.query.get_or_404(id)
        return payment, 200

    @payment_ns.expect(payment_model)
    @jwt_required()
    def put(self, id):
        """Update a payment by id"""
        try:
            data = request.get_json()
            payment_to_update = Payment.query.get_or_404(id)
            payment_to_update.update(**data)

            db.session.commit()

            return jsonify({'message': 'Payment updated successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))

    @jwt_required()
    def delete(self, id):
        """Delete a payment by id"""
        try:
            payment_to_delete = Payment.query.get_or_404(id)
            db.session.delete(payment_to_delete)
            db.session.commit()

            return jsonify({'message': 'Payment deleted successfully'})
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))
