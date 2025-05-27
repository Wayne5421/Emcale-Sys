from flask import jsonify
from models.ordem_servico import OrdemServico
from models.tecnico import Tecnico  # caso queira incluir nome do técnico
from extensions import db

def listar_ordens_servico_route(app):
    @app.route('/listar-ordens-servico', methods=['GET'])
    def listar_ordens_servico():
        ordens = OrdemServico.query.all()
        if not ordens:
            return jsonify({'message': 'Nenhuma ordem encontrada'}), 404

        lista = []
        for ordem in ordens:
            lista.append({
                'id': ordem.id,
                'wo_projeto': ordem.wo_projeto,
                'cidade': ordem.cidade,
                'regional': ordem.regional,
                'escopo': ordem.escopo,
                'premissas': ordem.premissas,
                'data_abertura': ordem.data_abertura.isoformat(),
                'prazo': ordem.prazo.isoformat(),
                'id_tecnico': ordem.id_tecnico,
                'nome_tecnico': ordem.tecnico.nome if ordem.tecnico else None
            })

        return jsonify({'ordens_servico': lista}), 200
