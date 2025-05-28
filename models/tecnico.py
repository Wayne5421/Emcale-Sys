from extensions import db

class Tecnico(db.Model):
    __tablename__ = 'tecnicos'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    rg = db.Column(db.String(20))
    telefone = db.Column(db.String(20))
    servicos_prestados = db.Column(db.Text)

    ordens_servico = db.relationship('OrdemServico', backref='tecnico', lazy=True)

    def __repr__(self):
        return f'<Tecnico {self.nome}>'
