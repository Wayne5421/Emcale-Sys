from flask import request, jsonify
from models.usuario import Usuario
import jwt
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def gerar_token(usuario):
    payload = {
        'usuario': usuario.usuario,
        'permissao': usuario.permissao.nome,
        'exp': datetime.datetime.now() + datetime.timedelta(hours=1)  # O token expira em 1 hora
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')



def login_routes(app):
    @app.route('/login', methods=['POST'])
    def login():
        
        data = request.get_json()
        usuario_input = data.get('usuario')
        senha_input = data.get('senha')

        if not usuario_input or not senha_input:
            return jsonify({'error': 'Usuário e senha são obrigatórios'}), 400

        usuario = Usuario.query.filter_by(usuario=usuario_input).first()

        if usuario and usuario.senha == senha_input:
            
            token = gerar_token(usuario)
            
            
            return jsonify({
                'message': 'Login bem-sucedido',
                'usuario': usuario.usuario,
                'nome_completo': usuario.nome_completo,
                'permissao': usuario.permissao.nome,
                'token': token
            })
        else:
            return jsonify({'error': 'Usuário ou senha inválidos'}), 401
