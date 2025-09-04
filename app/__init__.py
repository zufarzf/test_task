from flask import Flask
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_wtf.csrf import CSRFProtect
from flask_moment import Moment

from config import config




csrf_protect = CSRFProtect()
migrate = Migrate()
socketio = SocketIO()
db = SQLAlchemy()
moment = Moment()




from . import dbModels




def create_app(config_type:str):
    app = Flask(__name__)
    app.config.from_object(config[config_type])

    #Initialization
    db.init_app(app)
    csrf_protect.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, async_mode='gevent')
    moment.init_app(app)

    #Register a Blueprint
    from .auth import auth
    from .admin import admin
    from .products import products
    from .orderPanel import orderPanel

    app.register_blueprint(auth)
    app.register_blueprint(admin, url_prefix="/admin")
    app.register_blueprint(products, url_prefix="/products")
    app.register_blueprint(orderPanel, url_prefix="/order-panel")

    return app