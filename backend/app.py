# backend/app.py
from flask import Flask
from dotenv import load_dotenv
import os
from routes.atualizar_usuario import atualizar_usuario_route
from routes.deletar_usuario import deletar_usuario_route
from routes.login import login_routes
from routes.criar_usuario import criar_usuario_route
from extensions import db 
from flask_cors import CORS

load_dotenv()


app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


db.init_app(app)


login_routes(app)
# criar_usuario_route(app)
# deletar_usuario_route(app)
# atualizar_usuario_route(app)


if __name__ == "__main__":
    app.run(debug=True)
