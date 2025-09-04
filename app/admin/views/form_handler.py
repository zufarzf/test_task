from flask import url_for, redirect, flash, request, session
from .. import admin
from ... import db
from ..forms import DefaultForm
from ...auth.views.functions import login_required




@admin.route('/staff/car-form/handler/<int:car_id>', methods=["POST"])
@login_required
def car_form_handler(car_id):
    form = DefaultForm()
    return redirect(
        url_for(
            'admin.car_form',
            car_id = car_id,
            )
        )




@admin.route('/staff/staff-form/handler/<int:staff_id>', methods=["POST"])
@login_required
def staff_form_handler(staff_id):
    form = DefaultForm()
    return redirect(
        url_for(
            'admin.staff_form',
            staff_id = staff_id,
            )
        )



