from flask import request, jsonify
from models.ordem_servico import OrdemServico
from extensions import db
from datetime import datetime, timedelta
from flask_cors import cross_origin

def atualizar_ordem_servico_route(app):
    @app.route('/atualizar-ordem-servico/<int:id>', methods=['PUT', 'OPTIONS'])
    @cross_origin()
    def atualizar_ordem_servico(id):
        data = request.get_json()

        ordem = OrdemServico.query.get(id)
        if not ordem:
            return jsonify({'error': 'Ordem de serviço não encontrada'}), 404

        wo_projeto = data.get('wo_projeto')
        cidade = data.get('cidade')
        regional = data.get('regional')
        escopo = data.get('escopo')
        premissas = data.get('premissas')
        prazo_desktop_str = data.get('prazo_desktop')
        id_tecnico = data.get('id_tecnico')
        id_status = data.get('id_status')

        if wo_projeto:
            ordem.wo_projeto = wo_projeto
        if cidade:
            ordem.cidade = cidade
        if regional:
            ordem.regional = regional
        if escopo is not None:
            ordem.escopo = escopo
        if premissas is not None:
            ordem.premissas = premissas
        if id_tecnico is not None:
            ordem.id_tecnico = id_tecnico
        if id_status is not None:
            ordem.id_status = id_status

        if prazo_desktop_str:
            try:
                prazo_desktop = datetime.strptime(prazo_desktop_str, '%Y-%m-%d').date()
                ordem.prazo_desktop = prazo_desktop
                ordem.prazo_tecnico = prazo_desktop - timedelta(days=5)
            except ValueError:
                return jsonify({'error': 'Formato de data inválido para prazo_desktop (esperado YYYY-MM-DD)'}), 400

        try:
            db.session.commit()
            return jsonify({'message': 'Ordem de serviço atualizada com sucesso'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Erro ao atualizar: {str(e)}'}), 500
