from flask import render_template, url_for, redirect, flash, request, session
from .. import auth
from ... import db
from ...dbModels.staff import Staff
from ...dbModels.user import User
from werkzeug.security import generate_password_hash as gPswHash, check_password_hash as chPswHash
from ..forms import LoginForm, LockScreenForm, RegistrationForm
from .functions import check_login, login_required




@auth.route('/')
@auth.route('/login')
@check_login
def login():    
    if User.query.first() is None:
        create_user = User(
            name = 'SuperAdmin',
            phone = '123456789',
            psw = gPswHash('12345'),
        )
        create_staff = Staff(user = create_user)

        db.session.add_all([
                create_user,
                create_staff,
            ])
        db.session.commit()
    
    return render_template(
        'auth-login.html',
        form = LoginForm()
    )




@auth.route('/registration')
@check_login
def registration():    
    return render_template(
        'auth-registration.html',
        form = RegistrationForm()
    )




@auth.route('/profile')
@login_required
def profile():
    return render_template('pages-profile.html')




@auth.route('/lock_screen')
@login_required
def lock_screen():
    form = LockScreenForm()
    session['lock_screen'] = True
    return render_template(
            'auth-lock-screen.html',
            form = form
        )




@auth.route('/logout')
@login_required
def logout():
    session.clear()
    return render_template('auth-logout.html')