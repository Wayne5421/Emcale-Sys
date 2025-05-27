from flask import request, jsonify
from models.tecnico import Tecnico
from extensions import db

def listar_tecnicos_route(app):
    @app.route('/listar-tecnicos', methods=['GET'])
    def listar_tecnicos():
        tecnicos = Tecnico.query.all()
        if not tecnicos:
            return jsonify({'message': 'Nenhum técnico encontrado'}), 404

        tecnicos_list = []
        for tecnico in tecnicos:
            tecnicos_list.append({
                'id': tecnico.id,
                'nome': tecnico.nome,
                'cpf': tecnico.cpf,
                'rg': tecnico.rg,
                'telefone': tecnico.telefone,
                'servicos_prestados': tecnico.servicos_prestados
            })

        return jsonify({'tecnicos': tecnicos_list}), 200
