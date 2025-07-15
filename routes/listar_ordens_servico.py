from flask import jsonify
from models.ordem_servico import OrdemServico
from models.tecnico import Tecnico  
from models.materiais import Material
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
                'prazo_desktop': ordem.prazo_desktop.isoformat() if ordem.prazo_desktop else None,
                'prazo_tecnico': ordem.prazo_tecnico.isoformat() if ordem.prazo_tecnico else None,
                'id_tecnico': ordem.id_tecnico,
                'nome_tecnico': ordem.tecnico.nome if ordem.tecnico else None,
                'id_status': ordem.id_status,
                'descricao_status': ordem.status.descricao if ordem.status else None,
                'observacao': ordem.observacoes[0].observacao if ordem.observacoes else None,
                'materiais': ordem.materiais[0].material   if ordem.materiais   else None
            })

        return jsonify({'ordens_servico': lista}), 200
