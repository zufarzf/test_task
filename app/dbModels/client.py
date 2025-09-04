from .. import db
from datetime import datetime, timezone




class Client(db.Model):
    __tablename__ = 'client'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    order = db.relationship('Order', backref='client', lazy='dynamic')


    def __repr__(self):
        return f'<Client -> id: {self.id}, name: {self.name}>'


