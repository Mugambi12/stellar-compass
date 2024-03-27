from sqlalchemy.orm import relationship
from exts import db

# User Table
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    orders = relationship('Order', backref='user', lazy=True)
    statements = relationship('Statement', backref='user', lazy=True)

    def __repr__(self):
        return f"<User('{self.username}', '{self.email}')>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

# Medication Table
class Medication(db.Model):
    __tablename__ = 'medications'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False)
    orders = relationship('Order', backref='medication', lazy=True)

    def __repr__(self):
        return f"<Medication('{self.name}', '{self.price}')>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, description, price, stock_quantity):
        self.name = name
        self.description = description
        self.price = price
        self.stock_quantity = stock_quantity

# Order Table
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    order_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Pending')  # Pending, Confirmed, Delivered

    def __repr__(self):
        return f"<Order('{self.user_id}', '{self.medication_id}', '{self.total_price}')>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, quantity, total_price, order_date, status):
        self.quantity = quantity
        self.total_price = total_price
        self.order_date = order_date
        self.status = status

# Statement Table
class Statement(db.Model):
    __tablename__ = 'statements'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
