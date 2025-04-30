from flask import request, jsonify
from models.usuario import Usuario
from extensions import db 

def deletar_usuario_route(app):
    @app.route('/deletar-usuario/<int:id>', methods=['DELETE'])
    def deletar_usuario(id):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token de autorização não fornecido'}), 401
        
        token = token.split(" ")[1]
        
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        try:
            db.session.delete(usuario)  # Exclui o usuário
            db.session.commit()
            return jsonify({'message': f'Usuário {usuario.usuario} deletado com sucesso!'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Ocorreu um erro ao deletar o usuário: {str(e)}'}), 500
