from flask_wtf import FlaskForm
from wtforms import StringField, HiddenField, TextAreaField, FileField, PasswordField, BooleanField, SubmitField, EmailField
from wtforms.validators import Length, DataRequired, EqualTo, Email




class CategoryForm(FlaskForm):
    name = StringField(
			validators=[DataRequired()]
		)




class ProductForm(FlaskForm):
    category = StringField(
			validators=[DataRequired()]
		)
    category_id = HiddenField(
			validators=[DataRequired()]
		)
    name = StringField(
			validators=[DataRequired()]
		)
    price = StringField(
			validators=[DataRequired()]
		)