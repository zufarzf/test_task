from flask import Blueprint

orderPanel = Blueprint(
    'orderPanel',
    __name__,
    template_folder='orderPanel-templates',
    static_folder='orderPanel-static'
    )


from . import views