from flask import url_for, redirect, flash, request, session
from .. import orderPanel
from ... import db, socketio
from ..forms import DefaultForm
from ...auth.views.functions import login_required
from ...products.views.functions import de_format_number

from ...dbModels.user import User
from ...dbModels.order import Order, OrderStatus, OrderProducts
from ...dbModels.product import *
from .functions import generate_order_number, get_total_order_status_count




@orderPanel.route('/add-order-product-selection-form/<int:order_id>', methods=["POST"])
@login_required
def add_order_product_selection_form(order_id):
    form = DefaultForm()

    if form.validate_on_submit():
        product_ids = request.form.getlist('product_id')
        product_quantities = request.form.getlist('product_quantity')
        notes = request.form.getlist('note')

        try:
            user_data = session.get('user_data')
            
            order = Order(
                user_id = user_data.get('id'),
                client_id = user_data.get('client_id'),
            )
            db.session.add(order)
            db.session.flush()
            
            uniq_number = generate_order_number(order.id)
            order.uniq_number = uniq_number
            total_price = 0

            for product_id, product_quantity, note in zip(product_ids, product_quantities, notes):
                product_id = int(product_id) if product_id else None
                product_quantity = de_format_number(product_quantity)
                note = str(note).strip() if note else None

                product = Product.query.get(product_id)
                if not product:
                    flash('Товар не найден!', category='danger')
                    return redirect(
                        url_for(
                            'orderPanel.add_order_product_selection',
                            order_id = order_id,
                        )
                    )
                
                order_product = OrderProducts(
                    order = order,
                    product = product,
                    product_category_id = product.category_id,
                    count = product_quantity,
                    price = product.price,
                    note = note,
                )
                db.session.add(order_product)
                total_price += product.price * product_quantity
            
            order_id = order.id
            order.total_price = total_price
            db.session.commit()

            user = User.query.get(user_data.get('id'))
            orders_data = [
                dict(
                    id=order.id,
                    uniq_number=uniq_number,
                    order_url=url_for('orderPanel.order_info', order_id=order_id),
                    status=order.status.value,
                    total_price=order.total_price,
                    create_datetime=f'{order.create_datetime}',
                    update_datetime=f'{order.update_datetime}' if order.update_datetime else '',
                    client_name=user.name,
                    client_phone=user.phone,
                )
            ]
            socketio.emit('update_order', orders_data)
            socketio.emit('update-order-status-count', get_total_order_status_count())

            flash('Заказ успешно создан!', category='success')
            return redirect(url_for('orderPanel.main'))
        
        except:
            flash('Ошибка при сохранении!', category='danger')
            return redirect(
                url_for(
                    'orderPanel.add_order_product_selection',
                    order_id = order_id,
                )
            )

    flash('Форма заполнена не правильно!', category='danger')
    return redirect(
        url_for(
            'orderPanel.add_order_product_selection',
            order_id = order_id,
            )
        )