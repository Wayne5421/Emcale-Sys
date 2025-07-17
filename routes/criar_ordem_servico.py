from flask import request, jsonify
from models.materiais import Material
from models.ordem_servico import OrdemServico
from models.observacao import Observacao

from extensions import db
from datetime import datetime, timedelta

def criar_ordem_servico_route(app):
    @app.route('/criar-ordem-servico', methods=['POST'])
    def criar_ordem_servico():
        data = request.get_json()

        wo_projeto        = data.get('wo_projeto')
        cidade            = data.get('cidade')
        regional          = data.get('regional')
        escopo            = data.get('escopo')
        premissas         = data.get('premissas')
        prazo_desktop_str = data.get('prazo_desktop')
        data_entrega_str  = data.get('data_entrega')
        id_tecnico        = data.get('id_tecnico')
        id_status         = data.get('id_status')
        observacao_texto  = data.get('observacao')
        materiais_texto   = data.get('materiais')

        if not wo_projeto or not prazo_desktop_str:
            return jsonify({'error': 'WO/Projeto e prazo_desktop são obrigatórios'}), 400

        try:
            prazo_desktop = datetime.strptime(prazo_desktop_str, '%Y-%m-%d').date()
            prazo_tecnico = prazo_desktop - timedelta(days=5)

            data_entrega = None
            if data_entrega_str:
                data_entrega = datetime.strptime(data_entrega_str, '%Y-%m-%d').date()

            nova_ordem = OrdemServico(
                wo_projeto     = wo_projeto,
                cidade         = cidade,
                regional       = regional,
                escopo         = escopo,
                premissas      = premissas,
                prazo_desktop  = prazo_desktop,
                prazo_tecnico  = prazo_tecnico,
                data_entrega   = data_entrega,  
                id_tecnico     = id_tecnico,
                id_status      = id_status
            )

            db.session.add(nova_ordem)
            db.session.flush()

            if observacao_texto:
                db.session.add(Observacao(
                    observacao = observacao_texto,
                    id_ordem   = nova_ordem.id
                ))

            if materiais_texto:
                db.session.add(Material(
                    material = materiais_texto,
                    id_ordem = nova_ordem.id
                ))

            db.session.commit()
            return jsonify({'message': f'Ordem {wo_projeto} criada com sucesso!'}), 201

        except ValueError:
            db.session.rollback()
            return jsonify({'error': 'Formato de data inválido para prazo_desktop ou data_entrega (esperado YYYY-MM-DD)'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Erro ao criar ordem: {str(e)}'}), 500
