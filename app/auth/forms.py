from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FileField, PasswordField, BooleanField, SubmitField, EmailField
from wtforms.validators import Length, DataRequired, EqualTo, Email




class LoginForm(FlaskForm):
    phone = StringField(
			validators=[DataRequired()]
		)
    psw = PasswordField(
			validators=[DataRequired()]
		)
    submit = SubmitField()




class RegistrationForm(FlaskForm):
    name = StringField(
			validators=[DataRequired()]
		)
    phone = StringField(
			validators=[DataRequired()]
		)
    psw = PasswordField(
			validators=[DataRequired()]
		)
    psw_equal = PasswordField(
			validators=[
				DataRequired(),
				EqualTo('psw', message="Пароли должны совпадать!")
			]
		)
    submit = SubmitField()




class LockScreenForm(FlaskForm):
    psw = PasswordField(
			validators=[DataRequired()]
		)
    submit = SubmitField()