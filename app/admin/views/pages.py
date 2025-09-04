from flask import render_template, url_for, redirect, flash, request, session
from .. import admin
from ... import db
from ..forms import DefaultForm
from ...auth.views.functions import login_required
from ...dbModels.user import User
from ...dbModels.staff import Staff




@admin.route('/staff')
@login_required
def staff():
    staff = db.session.query(
        User.name,
        User.phone,
        User.create_datetime,
    ).join(
        Staff,
        Staff.user_id == User.id
    ).all()
    return render_template(
        'staff.html',
        staff = staff
    )