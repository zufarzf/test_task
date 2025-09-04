from flask import render_template, url_for, redirect, flash, request, session
from .. import orderPanel
from ... import db
from ..forms import DefaultForm
from ...auth.views.functions import login_required

from ...dbModels.product import ProductCategory, Product
from ...dbModels.order import Order, OrderStatus, OrderProducts
from ...dbModels.user import User
from ...dbModels.client import Client
from sqlalchemy import and_



@orderPanel.route('/')
@login_required
def main():
    orders_query = db.session.query(
        Order.id,
        Order.uniq_number,
        Order.status,
        Order.total_price,
        Order.create_datetime,
        Order.update_datetime,
        User.name.label('client_name'),
        User.phone.label('client_phone'),
    )

    client_id = session['user_data'].get('client_id')
    if client_id:
        orders_join = orders_query.join(
            User,
            and_(
                User.id == Order.user_id,
                Order.client_id == client_id,
            )
        )
    else:
        orders_join = orders_query.join(
            User,
            User.id == Order.user_id,
        )

    orders = orders_join.all()

    return render_template(
        'orders-desk.html',
        orders = orders[::-1]
    )




@orderPanel.route('/order_info/<int:order_id>')
@login_required
def order_info(order_id):
    orders_query = db.session.query(
        Order.id,
        Order.uniq_number,
        Order.status,
        Order.total_price,
        Order.create_datetime,
        Order.update_datetime,
        User.name.label('client_name'),
        User.phone.label('client_phone'),
    )

    client_id = session['user_data'].get('client_id')
    if client_id:
        orders_join = orders_query.join(
            User,
            and_(
                User.id == Order.user_id,
                Order.client_id == client_id,
                Order.id == order_id,
            )
        )
    else:
        orders_join = orders_query.join(
            User,
            User.id == Order.user_id,
        )
    order = orders_join.first()

    products = db.session.query(
        Product.id,
        Product.name,
        ProductCategory.id.label('category_id'),
        ProductCategory.name.label('category'),

        OrderProducts.count,
        OrderProducts.price,
        OrderProducts.note,
        OrderProducts.create_datetime,
    ).join(
        ProductCategory,
        ProductCategory.id == Product.category_id,
    ).join(
        OrderProducts,
        and_(
            OrderProducts.product_id == Product.id,
            OrderProducts.order_id == order_id,
        )
    ).all()

    return render_template(
        'order-info.html',
        order_id = order_id,
        order = order,
        products = products,
    )




@orderPanel.route('/clients_list')
@login_required
def clients_list():
    clients = db.session.query(
        User.name,
        User.phone,
        User.create_datetime,
    ).join(
        Client,
        Client.user_id == User.id
    ).all()
    return render_template(
        'clients-list.html',
        clients = clients
    )





@orderPanel.route('/add-order-product-selection/<int:order_id>')
@login_required
def add_order_product_selection(order_id):
    form = DefaultForm()
    products = db.session.query(
        Product.id,
        Product.name,
        Product.price,
        Product.status,
        Product.create_datetime,
        ProductCategory.id.label('category_id'),
        ProductCategory.name.label('category'),
    ).join(
        ProductCategory,
        ProductCategory.id == Product.category_id
    ).all()
    
    return render_template(
        'add-order-product-selection-form.html',
        order_id = order_id,
        form = form,
        products = products[::-1]
        )