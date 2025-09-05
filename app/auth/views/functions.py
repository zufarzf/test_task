from flask import url_for, redirect, flash, session, request
from functools import wraps
import re




def check_lock_screen():
    session.get('lock_screen') and request.path != url_for('auth.lock_screen') and request.path != url_for('auth.open_lock_screen')


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if check_lock_screen():
            flash('Чтобы войти в систему сначала введите пароль!', category='danger')
            return redirect(url_for('auth.lock_screen'))
        
        if not session.get('user_data'):
            flash('Чтобы войти в систему сначала авторизуйтесь!', category='danger')
            return redirect(url_for('auth.login'))
        return func(*args, **kwargs)
    return wrapper


def check_login(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        
        if session.get('user_data'):
            if check_lock_screen():
                return redirect(url_for('auth.lock_screen'))
            return redirect(url_for('orderPanel.main'))
        
        return func(*args, **kwargs)
    return wrapper




def normalize_phone(phone: str, keep_plus: bool = True) -> str:
    """
    Нормализация номера телефона.
    Убирает пробелы, скобки, дефисы и лишние символы.
    
    :param phone: исходная строка с телефоном
    :param keep_plus: сохранять ли знак "+" в начале
    :return: очищенный номер
    """
    phone = str(phone).strip()

    if keep_plus:
        # Если есть плюс в начале, временно уберём
        has_plus = phone.startswith('+')
        phone = re.sub(r"\D", "", phone)  # оставляем только цифры
        return '+' + phone if has_plus else phone
    else:
        return re.sub(r"\D", "", phone)
