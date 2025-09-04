from flask import render_template, url_for, redirect, flash, request, session
from ... import db, socketio
from ...auth.views.functions import login_required
from ...dbModels.product import ProductCategory, Product




@socketio.on('remove-product')
@login_required
def remove_category(product_id:str=None):
	if product_id and product_id.isdigit():
		product = Product.query.get(int(product_id))
		
		if product:
			response = [
				dict(
					remove=True,
					id=product.id,
				)
			]

			try:
				db.session.delete(product)
				db.session.commit()
			except:
				print('--- --- --- --- --- ---')
				print('Ошибка при удалении!')
				print('--- --- --- --- --- ---')


			socketio.emit(
					'update_product',
					response,
				)




@socketio.on('remove-category')
@login_required
def remove_category(category_id:str=None):
	if category_id and category_id.isdigit():
		category = ProductCategory.query.get(int(category_id))
		
		if category:
			product = category.product.first()
			if not product:
				response = [
					dict(
						remove=True,
						id=category.id,
					)
				]

				try:
					db.session.delete(category)
					db.session.commit()
				except:
					print('--- --- --- --- --- ---')
					print('Ошибка при удалении!')
					print('--- --- --- --- --- ---')


				socketio.emit(
						'update_products_category',
						response,
					)




@socketio.on('get-categories-for-dropdown')
@login_required
def get_categories_for_dropdown(data=None):
	categories = ProductCategory.query.all()
	response = [
		dict(
			text=category.name,
			addl_data=category.id,
		) for category in categories
	]
	
	socketio.emit(
			'fill_in_the_dropdown',
			response,
		)




@socketio.on('server-update-product-status')
@login_required
def server__update_product_status(product_id=None):
	if product_id and str(product_id).isdigit():
		product = Product.query.get(int(product_id))
		
		if product:
			product.status = False if product.status else True
			db.session.commit()

			socketio.emit(
					'client-update-product-status',
					dict(
						id=product.id,
						status=product.status,
					),
				)