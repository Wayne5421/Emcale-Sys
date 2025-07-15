from flask import request, jsonify
from models.ordem_servico import OrdemServico
from models.observacao   import Observacao
from models.materiais    import Material
from extensions import db
from flask_cors import cross_origin

def deletar_ordem_servico_route(app):
    @app.route('/deletar-ordem-servico/<int:id>', methods=['DELETE', 'OPTIONS'])
    @cross_origin()
    def deletar_ordem_servico(id):
        ordem = OrdemServico.query.get(id)
        if not ordem:
            return jsonify({'error': 'Ordem não encontrada'}), 404

        try:
            for obs in ordem.observacoes:
                db.session.delete(obs)
            for mat in ordem.materiais:
                db.session.delete(mat)

            db.session.delete(ordem)
            db.session.commit()
            return jsonify({'message': 'Ordem de serviço deletada com sucesso'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Erro ao deletar: {str(e)}'}), 500
