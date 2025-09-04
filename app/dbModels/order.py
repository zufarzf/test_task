from .. import db
from datetime import datetime, timezone
import enum




class OrderStatus(enum.Enum):
    NEW = 'new'             # новый
    CONFIRMED = 'confirmed' # подтвержден
    PREPARING = 'preparing' # готовится
    READY = 'ready'         # готов
    COMPLETED = 'completed' # выполнен
    CANCELED = 'canceled'   # отменен


class Order(db.Model):
    __tablename__ = 'order'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    uniq_number = db.Column(db.String(250))
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.NEW, nullable=False)
    total_price = db.Column(db.Float, default=0)
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    update_datetime = db.Column(db.DateTime)

    order_products = db.relationship('OrderProducts', backref='order', lazy='dynamic')


    def __repr__(self):
        return f'<Order -> id: {self.id}, uniq_number: {self.uniq_number}>'




class OrderProducts(db.Model):
    __tablename__ = 'order_products'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product_category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'))

    count = db.Column(db.Float)
    price = db.Column(db.Float, default=0)
    note = db.Column(db.String(300))
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))


    def __repr__(self):
        return f'<OrderProduct -> id: {self.id}, price: {self.price}>'

