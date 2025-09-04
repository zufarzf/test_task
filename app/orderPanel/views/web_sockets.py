from flask import render_template, url_for, redirect, flash, request, session
from ... import db, socketio
from ...auth.views.functions import login_required

from ...dbModels.order import Order, OrderStatus
from ...dbModels.user import User
from ...dbModels.client import Client
from sqlalchemy import and_
from datetime import datetime, timezone
from .functions import get_total_order_status_count




@socketio.on('server-update-order-status')
@login_required
def server__update_order_status(data=None):
	if data.get('id') and data.get('status'):
		order = Order.query.get(int(data.get('id')))

		if order:
			status = getattr(OrderStatus, data.get('status'), None)
			
			if status:
				order.status = status
				update_datetime = datetime.now(timezone.utc)
				order.update_datetime = update_datetime
				db.session.commit()

				response = dict(
					id=int(data.get('id')),
					status=getattr(OrderStatus, data.get('status')).value,
					update_datetime=update_datetime.strftime("%Y-%m-%d %H:%M:%S"),
				)
				socketio.emit('client-update-order-status', response)
				socketio.emit('update-order-status-count', get_total_order_status_count())





@socketio.on('server-update-order-status-count')
@login_required
def server__update_order_status_count():
	socketio.emit('update-order-status-count', get_total_order_status_count())