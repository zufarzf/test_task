from flask import url_for, redirect, flash, session
from .. import products
from ... import db, socketio
from ..forms import CategoryForm, ProductForm
from ...auth.views.functions import login_required

from ...dbModels.product import ProductCategory, Product

from .functions import de_format_number




@products.route('/product-categories/product-category-form/<int:category_id>', methods=["POST"])
@login_required
def product_category_form(category_id):
	form = CategoryForm()

	if form.validate_on_submit():
		name = str(form.name.data).strip() if form.name.data else None
		
		this_category = ProductCategory.query.get(category_id) if category_id else None
		if this_category is None and category_id:
			flash('Категория не найдена!', category='danger')
			return redirect(url_for('products.product_categories'))


		category = ProductCategory.query.filter_by(name = name).first()
		if category and category.id != this_category.id:
			flash('Категория с таким названием уже существует!', category='danger')
			return redirect(
                url_for(
					'products.add_product_category',
					category_id = category_id,
				)
			)
		
		try:
			if this_category:
				this_category.name = name
			else:
				new_category = ProductCategory(name = name)
				db.session.add(new_category)
				db.session.flush()
				
				category_id = new_category.id
			
			db.session.commit()

			products_data = [
				dict(
					id=category_id,
					name=name,
					edit_url=url_for('products.add_product_category', category_id=category_id),
				)
			]
			socketio.emit('update_products_category', products_data)

			flash(
				'Категория добавлена!' if not this_category else 'Категория редактирована!',
				category='success'
			)
			return redirect(
				url_for(
					'products.product_categories',
					category_id = 0 if not this_category else category_id
				)
			)
		except:
			flash('Ошибка при сохранении!', category='danger')
			return redirect(
				url_for(
					'products.add_product_category',
					category_id = category_id,
				)
			)
    
	flash('Форма заполнена не правильно!', category='danger')
	return redirect(
		url_for(
			'products.add_product_category',
			category_id = category_id,
		)
	)




@products.route('/add-product/add-product-form/<int:product_id>', methods=["POST"])
@login_required
def add_product_form(product_id):
	form = ProductForm()

	if form.validate_on_submit():
		category_id = int(form.category_id.data) if form.category_id.data else None
		name = str(form.name.data).strip() if form.name.data else None
		price = de_format_number(form.price.data)
		
		this_product = Product.query.get(product_id) if product_id else None
		if this_product is None and product_id:
			flash('Товар не найдена!', category='danger')
			return redirect(url_for('products.main'))
		
		this_product_id = 0 if not this_product else this_product.id
		
		category = ProductCategory.query.get(category_id) if category_id else None
		if category is None and category_id:
			flash('Категория не найдена!', category='danger')
			return redirect(url_for('products.add_product', product_id=product_id))


		product = Product.query.filter_by(name = name).first()
		if product and product.id != this_product_id:
			flash('Товар с таким названием уже существует!', category='danger')
			return redirect(
                url_for(
					'products.add_product',
					product_id=product_id,
				)
			)
		try:
			if this_product:
				this_product.category_id = category_id
				this_product.name = name
				this_product.price = price
			else:
				new_product = Product(
					category = category,
					name = name,
					price = price,
				)
				db.session.add(new_product)
				db.session.flush()
				
				product_id = new_product.id
			
			db.session.commit()

			products_data = [
				dict(
					id=product_id,
					name=name,
					category=category.name,
					price=price,
					edit_url=url_for('products.add_product', product_id=product_id),
				)
			]
			socketio.emit('update_product', products_data)

			flash(
				'Товар добавлен!' if not this_product else 'Товар редактирован!',
				category='success'
			)
			return redirect(
				url_for(
					'products.add_product',
					product_id = 0 if not this_product else product_id
				)
			)
		except:
			flash('Ошибка при сохранении!', category='danger')
			return redirect(
				url_for(
					'products.add_product',
					product_id = product_id,
				)
			)
    
	flash('Форма заполнена не правильно!', category='danger')
	return redirect(
		url_for(
			'products.add_product',
			product_id = product_id,
		)
	)