from flask import jsonify
from models.status import Status 

def listar_status_route(app):
    @app.route('/listar-status', methods=['GET'])
    def listar_status():
        try:
            status_list_db = Status.query.all()
            
            if not status_list_db:
                return jsonify({'message': 'Nenhum status encontrado'}), 404

            status_json_list = []
            for status_item in status_list_db:
                status_json_list.append({
                    'id': status_item.id,
                    'descricao': status_item.descricao
                })

            return jsonify({'status': status_json_list}), 200
        except Exception as e:

            return jsonify({'error': 'Erro interno do servidor ao carregar status.'}), 500