from flask import render_template, url_for, redirect, flash, request, session
from .. import products
from ... import db
from ..forms import CategoryForm, ProductForm
from ...auth.views.functions import login_required
from ...dbModels.product import ProductCategory, Product
from sqlalchemy import and_




@products.route('/')
@login_required
def main():
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
        'products.html',
        products = products[::-1]
    )




@products.route('/product-categories')
@login_required
def product_categories():
    categories = ProductCategory.query.all()
    return render_template(
        'product-categories.html',
        categories = categories[::-1]
    )





@products.route('/add-product/<int:product_id>')
@login_required
def add_product(product_id):
    form = ProductForm()
    if product_id:
        product = db.session.query(
            Product.id,
            Product.name,
            Product.price,
            Product.status,
            Product.create_datetime,
            ProductCategory.id.label('category_id'),
            ProductCategory.name.label('category'),
        ).join(
            ProductCategory,
            and_(
                ProductCategory.id == Product.category_id,
                Product.id == product_id,
            )
        ).first()
        
        if not product:
            flash('Товар не найдена!', category='danger')
            return redirect(
				url_for(
					'products.add_product',
					product_id = product_id,
				)
			)
        
        form.category.data = product.category
        form.category_id.data = product.category_id
        form.name.data = product.name
        form.price.data = product.price
    
    return render_template(
        'product-form.html',
        form = form,
        product_id = product_id
    )


@products.route('/add-product-category/<int:category_id>')
@login_required
def add_product_category(category_id):
    form = CategoryForm()
    if category_id:
        category = ProductCategory.query.get(category_id)
        
        if not category:
            flash('Категория не найдена!', category='danger')
            return redirect(
				url_for(
					'products.add_product_category',
					category_id = category_id,
				)
			)
        
        form.name.data = category.name

    return render_template(
        'product-category-form.html',
        form = form,
        category_id = category_id
        )