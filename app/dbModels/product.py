from .. import db
from datetime import datetime, timezone




class ProductCategory(db.Model):
    __tablename__ = 'product_category'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(250), nullable=False)
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    product = db.relationship('Product', backref='category', lazy='dynamic')
    order_products = db.relationship('OrderProducts', backref='product_category', lazy='dynamic')


    def __repr__(self):
        return f'<ProductCategory -> id: {self.id}, name: {self.name}>'




class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'))

    name = db.Column(db.String(250), nullable=False)
    price = db.Column(db.Float, default=0)
    status = db.Column(db.Boolean, default=1)
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    order_products = db.relationship('OrderProducts', backref='product', lazy='dynamic')


    def __repr__(self):
        return f'<Product -> id: {self.id}, name: {self.name}>'


