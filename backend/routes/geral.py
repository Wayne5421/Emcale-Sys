from flask import jsonify
from sqlalchemy import text
from models import db

def geral_routes(app):
    @app.route('/')
    def home():
        return "Sistema funcionando"

    @app.route('/test-db')
    def test_db():
        try:
            result = db.session.execute(text("""
                SELECT usuario, senha, nome_completo 
                FROM usuarios
            """))

            for row in result:
                print(row)

            return "Conexão com o banco de dados bem-sucedida!"
        except Exception as e:
            return f"Erro ao conectar ao banco de dados: {str(e)}"
