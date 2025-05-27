from flask import request, jsonify
from models.ordem_servico import OrdemServico
from extensions import db
# from config import PRAZO_DELTA_PADRAO # Não precisamos mais subtrair PRAZO_DELTA_PADRAO aqui
from datetime import datetime

def criar_ordem_servico_route(app):
    @app.route('/criar-ordem-servico', methods=['POST'])
    def criar_ordem_servico():
        data = request.get_json()

        wo_projeto = data.get('wo_projeto')
        cidade = data.get('cidade')
        regional = data.get('regional')
        escopo = data.get('escopo')
        premissas = data.get('premissas')
        prazo_str = data.get('prazo') # Agora esperamos uma string de data
        id_tecnico = data.get('id_tecnico')

        if not wo_projeto or not prazo_str:
            return jsonify({'error': 'WO/Projeto e prazo são obrigatórios'}), 400

        try:
            prazo_final = datetime.strptime(prazo_str, '%Y-%m-%d').date() # Converta a string para date

            nova_ordem = OrdemServico(
                wo_projeto=wo_projeto,
                cidade=cidade,
                regional=regional,
                escopo=escopo,
                premissas=premissas,
                prazo=prazo_final,
                id_tecnico=id_tecnico
            )

            db.session.add(nova_ordem)
            db.session.commit()

            return jsonify({'message': f'Ordem {wo_projeto} criada com sucesso!'}), 201

        except ValueError:
            db.session.rollback()
            return jsonify({'error': 'Formato de data inválido para o prazo (esperado YYYY-MM-DD)'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Erro ao criar ordem: {str(e)}'}), 500