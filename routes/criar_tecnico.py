from flask import request, jsonify
from models.tecnico import Tecnico
from extensions import db

def criar_tecnico_route(app):
    @app.route('/criar-tecnico', methods=['POST'])
    def criar_tecnico():
        data = request.get_json()

        nome = data.get('nome')
        cpf = data.get('cpf')
        rg = data.get('rg')
        telefone = data.get('telefone')
        servicos_prestados = data.get('servicos_prestados')

        if not nome or not cpf:
            return jsonify({'error': 'Nome e CPF são obrigatórios'}), 400

        if Tecnico.query.filter_by(cpf=cpf).first():
            return jsonify({'error': 'Já existe um técnico com esse CPF'}), 400

        novo_tecnico = Tecnico(
            nome=nome,
            cpf=cpf,
            rg=rg,
            telefone=telefone,
            servicos_prestados=servicos_prestados
        )

        try:
            db.session.add(novo_tecnico)
            db.session.commit()
            return jsonify({'message': f'Técnico {nome} cadastrado com sucesso!'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Ocorreu um erro ao cadastrar o técnico: {str(e)}'}), 500