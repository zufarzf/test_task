from flask import Blueprint

auth = Blueprint(
    'auth',
    __name__,
    template_folder='auth-templates',
    static_folder='auth-static'
    )


from . import views