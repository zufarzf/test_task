from .. import db
from datetime import datetime, timezone




class Staff(db.Model):
    __tablename__ = 'staff'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    create_datetime = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # login = db.relationship('Login', backref='user', lazy='dynamic')


    def __repr__(self):
        return f'<Staff -> id: {self.id}, name: {self.name}>'


