# test_task
Тестовое задание от компании Jowi для отбора.


Система управления заказами (Fullstack demo).  
Позволяет клиентам создавать заказы, а персоналу — отслеживать и обновлять их статус в реальном времени.

## Основной функционал
- Создание заказа с выбором товаров
- Просмотр и фильтрация списка заказов
- Изменение и отмена заказов
- Обновление статусов в реальном времени (WebSocket/Socket.IO)
- Просмотр статистики по статусам

## Технологии
- Backend: Python (Flask, SQLAlchemy, Flask-Migrate, Socket.IO)
- Frontend: HTML, CSS, JavaScript (jQuery)
- DB: SQLite (легко заменить на PostgreSQL/MySQL)



## Установка и запуск
-Создать виртуальное окружение и установить зависимости
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate      # Windows

-Применить миграции и заполнить тестовыми данными
pip install -r requirements.txt
(Или Копируете эту строку и вставляете в консоль) ->> pip install Flask flask-sqlalchemy flask-migrate flask-wtf flask-moment flask-socketio pymysql flask-ckeditor gevent-websocket cryptography flask_jwt_extended bleach

Применить миграции и заполнить тестовыми данными
set FLASK_APP=run.py       # Windows
export FLASK_APP=run.py    # Linux / Mac

после Flask будет видеть файл старта приложения.
Теперь можно делать миграцию для создания бд таблиц.

flask db init
flask db migrate
flask db upgrade
python run.py


## Структура директорий
TEST/
├── __pycache__/
├── app/
│   ├── __pycache__/
│   ├── admin/
│   ├── auth/
│   ├── dbModels/
│   ├── orderPanel/
│   ├── products/
│   ├── static/
│   ├── templates/
│   └── __init__.py
├── migrations/
├── venv/
├── .gitignore
├── config.py
├── pip_lib_list.txt
├── requirements.txt
└── run.py
