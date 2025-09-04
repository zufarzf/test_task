from flask_wtf import FlaskForm
from wtforms import StringField, HiddenField, TextAreaField, FileField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Length, DataRequired, EqualTo, Email, Optional
from flask_ckeditor import CKEditorField




class DefaultForm(FlaskForm):
    product_quantity = StringField(
			validators=[DataRequired()]
		)
    product_id = HiddenField(
			validators=[DataRequired()]
		)
    note = TextAreaField(
			validators=[Optional()]
		)