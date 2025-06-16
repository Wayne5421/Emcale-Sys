from flask import request, jsonify
from models.ordem_servico import OrdemServico
from extensions import db
from datetime import datetime, timedelta

def criar_ordem_servico_route(app):
    @app.route('/criar-ordem-servico', methods=['POST'])
    def criar_ordem_servico():
        data = request.get_json()

        wo_projeto = data.get('wo_projeto')
        cidade = data.get('cidade')
        regional = data.get('regional')
        escopo = data.get('escopo')
        premissas = data.get('premissas')
        prazo_desktop_str = data.get('prazo_desktop')  # nome atualizado
        id_tecnico = data.get('id_tecnico')
        id_status = data.get('id_status')

        if not wo_projeto or not prazo_desktop_str:
            return jsonify({'error': 'WO/Projeto e prazo_desktop são obrigatórios'}), 400

        try:
            prazo_desktop = datetime.strptime(prazo_desktop_str, '%Y-%m-%d').date()
            prazo_tecnico = prazo_desktop - timedelta(days=5)

            nova_ordem = OrdemServico(
                wo_projeto=wo_projeto,
                cidade=cidade,
                regional=regional,
                escopo=escopo,
                premissas=premissas,
                prazo_desktop=prazo_desktop,
                prazo_tecnico=prazo_tecnico,
                id_tecnico=id_tecnico,
                id_status=id_status
            )

            db.session.add(nova_ordem)
            db.session.commit()

            return jsonify({'message': f'Ordem {wo_projeto} criada com sucesso!'}), 201

        except ValueError:
            db.session.rollback()
            return jsonify({'error': 'Formato de data inválido para o prazo_desktop (esperado YYYY-MM-DD)'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Erro ao criar ordem: {str(e)}'}), 500
