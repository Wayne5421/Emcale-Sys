from flask import request, jsonify
from models.usuario import Usuario
from extensions import db

def listar_usuarios_route(app):
    @app.route('/listar-usuarios', methods=['GET'])
    def listar_usuarios():
        # Simplesmente listar os usuários sem validar o token
        usuarios = Usuario.query.all()
        if not usuarios:
            return jsonify({'message': 'Nenhum usuário encontrado'}), 404
        
        usuarios_list = []
        for usuario in usuarios:
            usuarios_list.append({
                'id': usuario.id,
                'usuario': usuario.usuario,
                'nome_completo': usuario.nome_completo,
                'permissao': usuario.permissao.nome
            })
        
        return jsonify({'usuarios': usuarios_list}), 200
