from flask import request, jsonify
from models.tecnico import Tecnico
from extensions import db
from flask_cors import cross_origin

def deletar_tecnico_route(app):
    @app.route('/deletar-tecnico/<int:id>', methods=['DELETE', 'OPTIONS'])
    @cross_origin()
    def deletar_tecnico(id):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token de autorização não fornecido'}), 401

        token = token.split(" ")[1]

        tecnico = Tecnico.query.get(id)
        if not tecnico:
            return jsonify({'error': 'Técnico não encontrado'}), 404

        try:
            db.session.delete(tecnico)
            db.session.commit()
            return jsonify({'message': f'Técnico {tecnico.nome} deletado com sucesso!'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Erro ao deletar o técnico: {str(e)}'}), 500
