# backend/app.py
from flask import Flask
from dotenv import load_dotenv
import os
from extensions import db 
from flask_cors import CORS


from routes.atualizar_usuario import atualizar_usuario_route
from routes.deletar_usuario import deletar_usuario_route
from routes.login import login_routes
from routes.criar_usuario import criar_usuario_route
from routes.listar_usuarios import listar_usuarios_route


from routes.criar_tecnico import criar_tecnico_route
from routes.listar_tecnicos import listar_tecnicos_route
from routes.atualizar_tecnico import atualizar_tecnico_route
from routes.deletar_tecnico import deletar_tecnico_route

from routes.criar_ordem_servico import criar_ordem_servico_route
from routes.atualizar_ordem_servico import atualizar_ordem_servico_route
from routes.deletar_ordem_servico import deletar_ordem_servico_route
from routes.listar_ordens_servico import listar_ordens_servico_route

load_dotenv()


app = Flask(__name__)
CORS(app, supports_credentials=True)


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


db.init_app(app)


login_routes(app)
listar_usuarios_route(app)
criar_usuario_route(app)
deletar_usuario_route(app)
atualizar_usuario_route(app)
criar_tecnico_route(app)
listar_tecnicos_route(app)
atualizar_tecnico_route(app)
deletar_tecnico_route(app)
criar_ordem_servico_route(app)
atualizar_ordem_servico_route(app)
deletar_ordem_servico_route(app)
listar_ordens_servico_route(app)

if __name__ == "__main__":
    app.run(debug=True)
