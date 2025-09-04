from flask import Blueprint

products = Blueprint(
    'products',
    __name__,
    template_folder='products-templates',
    static_folder='products-static'
    )


from . import views