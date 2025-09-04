# from datetime import timedelta

from app import create_app, socketio
from os import environ
from config import config


app = create_app(environ.get('FLASK_ENV') or 'default')
# app.permanent_session_lifetime = timedelta(days=730)




if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8009)