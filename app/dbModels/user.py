from .. import db
from datetime import datetime, timezone




class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(250), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    psw = db.Column(db.Text)
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    staff = db.relationship('Staff', backref='user', lazy='dynamic')
    client = db.relationship('Client', backref='user', lazy='dynamic')
    order = db.relationship('Order', backref='user', lazy='dynamic')


    def __repr__(self):
        return f'<User -> id: {self.id}, name: {self.name}>'


