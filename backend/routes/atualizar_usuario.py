# backend/routes/atualizar_usuario.py
from flask import request, jsonify
from models.permissao import Permissao
from models.usuario import Usuario
from extensions import db 
from utils import verificar_permissao

def atualizar_usuario_route(app):
    @app.route('/atualizar-usuario/<int:id>', methods=['PUT'])
    def atualizar_usuario(id):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token de autorização não fornecido'}), 401
        
        token = token.split(" ")[1]
        
        if not verificar_permissao(token, ['dev', 'admin']):
            return jsonify({'error': 'Você não tem permissão para acessar esta rota'}), 403
        
        data = request.get_json()
        
        usuario_input = data.get('usuario')
        senha_input = data.get('senha')
        nome_completo_input = data.get('nome_completo')
        permissao_input = data.get('permissao')

        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        if usuario_input:
            usuario.usuario = usuario_input
        if senha_input:
            usuario.senha = senha_input
        if nome_completo_input:
            usuario.nome_completo = nome_completo_input
        if permissao_input:
            permissao = Permissao.query.filter_by(nome=permissao_input).first()
            if not permissao:
                return jsonify({'error': 'Permissão inválida'}), 400
            usuario.permissao_id = permissao.id
        
        try:
            db.session.commit()
            return jsonify({'message': f'Usuário {usuario.usuario} atualizado com sucesso!'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Ocorreu um erro ao atualizar o usuário: {str(e)}'}), 500
