from flask import request, jsonify
from models.usuario import Usuario
from models.permissao import Permissao
from extensions import db
from utils import verificar_permissao  
import jwt


def criar_usuario_route(app):
    @app.route('/criar-usuario', methods=['POST'])
    def criar_usuario():
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token de autorização não fornecido'}), 401
        
        token = token.split(" ")[1] 
        
        # Remover verificação de permissão aqui, já que o frontend vai fazer isso
        data = request.get_json()
        
        usuario_input = data.get('usuario')
        senha_input = data.get('senha')
        nome_completo_input = data.get('nome_completo')
        permissao_input = data.get('permissao')
        
        if not usuario_input or not senha_input or not nome_completo_input or not permissao_input:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        permissao = Permissao.query.filter_by(nome=permissao_input).first()
        if not permissao:
            return jsonify({'error': 'Permissão inválida'}), 400
        
        # Criar o novo usuário
        novo_usuario = Usuario(
            usuario=usuario_input,
            senha=senha_input,
            nome_completo=nome_completo_input,
            permissao_id=permissao.id
        )
        
        try:
            db.session.add(novo_usuario)
            db.session.commit()
            return jsonify({'message': f'Usuário {usuario_input} criado com sucesso!'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Ocorreu um erro ao criar o usuário: {str(e)}'}), 500
