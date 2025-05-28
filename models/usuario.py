from extensions import db
from models.permissao import Permissao

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    senha = db.Column(db.Text, nullable=False)
    nome_completo = db.Column(db.String(100), nullable=False)
    permissao_id = db.Column(db.Integer, db.ForeignKey('permissoes.id'), nullable=False)

    permissao = db.relationship('Permissao', backref='usuarios')

    def __repr__(self):
        return f'<Usuario {self.usuario}>'
