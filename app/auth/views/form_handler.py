from flask import url_for, redirect, flash, session
from .. import auth
from ... import db
from ...dbModels.client import Client
from ...dbModels.user import User

from werkzeug.security import generate_password_hash as gPswHash, check_password_hash as chPswHash
from ..forms import LoginForm, LockScreenForm, RegistrationForm
from .functions import check_login, login_required, normalize_phone




@auth.route('/login/authorization', methods=["POST"])
@check_login
def authorization():
    form = LoginForm()

    if form.validate_on_submit():
        phone = normalize_phone(form.phone.data) if form.phone.data else None
        psw = form.psw.data

        user = User.query.filter_by(phone = phone).first()
        if not user or not chPswHash(user.psw, psw):
            flash('Телефон или пароль не корректны!', category='danger')
            return redirect(url_for('auth.login'))

        session['user_data'] = dict(
                                id=user.id,
                                name=user.name,
                            )
        staff = user.staff.first()
        url = 'orderPanel.main'
        
        if staff:
            session['user_data']['staff_id'] = staff.id
        else:
            client = user.client.first()
            if client:
                session['user_data']['client_id'] = client.id


        flash('Вы успешно вошли!', category='success')
        return redirect(url_for(url))
    
    flash('Форма заполнена не правильно!', category='danger')
    return redirect(url_for('auth.login'))




@auth.route('/lock_screen/open_lock_screen', methods=["POST"])
@login_required
def open_lock_screen():
    form = LockScreenForm()

    if form.validate_on_submit():
        psw = form.psw.data
        user_id = session.get('user_data').get('id')
        
        user = User.query.get(user_id)
        if not user or not chPswHash(user.psw, psw):
            session.clear()
            flash('Неправильный пароль!', category='danger')
            return redirect(url_for('auth.login'))

        session['lock_screen'] = False

        flash('Успешно разблокировано!', category='success')
        return redirect(url_for('auth.profile'))
    
    flash('Форма заполнена не правильно!', category='danger')
    return redirect(url_for('auth.login'))




@auth.route('/registration/processing', methods=["POST"])
def registration_processing():
    form = RegistrationForm()

    if form.validate_on_submit():
        phone = normalize_phone(form.phone.data) if form.phone.data else None
        name = str(form.name.data).strip() if form.name.data else None
        psw = form.psw.data

        if User.query.filter_by(phone=phone).first() is not None:
            flash('Этот номер телефона занят!', category='danger')
            return redirect(url_for('auth.registration'))

        create_user = User(
            name = name,
            phone = phone,
            psw = gPswHash(psw),
        )
        create_client = Client(user = create_user)

        db.session.add_all([
                create_user,
                create_client,
            ])
        db.session.commit()
        
        flash('Вы успешно зарегистрировались!', category='success')
        flash('Теперь войдите введя свои данные.', category='success')
        return redirect(url_for('auth.login'))
    
    flash('Форма заполнена не правильно!', category='danger')
    return redirect(url_for('auth.registration'))
