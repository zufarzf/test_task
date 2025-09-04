from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FileField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Length, DataRequired, EqualTo, Email
from flask_ckeditor import CKEditorField




class DefaultForm(FlaskForm):
    # login = StringField(
	# 		validators=[DataRequired()]
	# 	)
    # psw = PasswordField(
	# 		validators=[DataRequired()]
	# 	)
    submit = SubmitField()