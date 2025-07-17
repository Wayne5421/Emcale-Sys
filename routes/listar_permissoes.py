from flask import jsonify
from models.permissao import Permissao 

def listar_permissoes_route(app):
    @app.route('/listar-permissoes', methods=['GET'])
    def listar_permissoes():
        try:
            permissoes_db = Permissao.query.all()

            if not permissoes_db:
                return jsonify({'message': 'Nenhuma permissão encontrada'}), 404

            permissoes_json = []
            for permissao in permissoes_db:
                permissoes_json.append({
                    'id': permissao.id,
                    'nome': permissao.nome
                })

            return jsonify({'permissoes': permissoes_json}), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Erro interno do servidor ao carregar permissões.'}), 500
