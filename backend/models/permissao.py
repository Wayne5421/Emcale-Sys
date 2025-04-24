from extensions import db

class Permissao(db.Model):
    __tablename__ = 'permissoes'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Permissao {self.nome}>'
