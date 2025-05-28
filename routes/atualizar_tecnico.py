# backend/routes/atualizar_tecnico.py
from flask import request, jsonify
from models.tecnico import Tecnico
from extensions import db
from flask_cors import cross_origin

def atualizar_tecnico_route(app):
    @app.route('/atualizar-tecnico/<int:id>', methods=['PUT', 'OPTIONS'])
    @cross_origin()
    def atualizar_tecnico(id):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token de autorização não fornecido'}), 401

        token = token.split(" ")[1]

        data = request.get_json()

        nome_input = data.get('nome')
        cpf_input = data.get('cpf')
        rg_input = data.get('rg')
        telefone_input = data.get('telefone')
        servicos_input = data.get('servicos_prestados')

        tecnico = Tecnico.query.get(id)
        if not tecnico:
            return jsonify({'error': 'Técnico não encontrado'}), 404

        if nome_input:
            tecnico.nome = nome_input
        if cpf_input:
            tecnico.cpf = cpf_input
        if rg_input:
            tecnico.rg = rg_input
        if telefone_input:
            tecnico.telefone = telefone_input
        if servicos_input is not None:  # aceita zero também
            tecnico.servicos_prestados = servicos_input

        try:
            db.session.commit()
            return jsonify({'message': f'Técnico {tecnico.nome} atualizado com sucesso!'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Ocorreu um erro ao atualizar o técnico: {str(e)}'}), 500
