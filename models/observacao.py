from extensions import db

class Observacao(db.Model):
    __tablename__ = 'observacoes'

    id = db.Column(db.Integer, primary_key=True)
    observacao = db.Column(db.Text, nullable=False)
    id_ordem = db.Column(db.Integer, db.ForeignKey('ordens_servico.id'), nullable=False)

    ordem = db.relationship('OrdemServico', backref='observacoes')

    def __repr__(self):
        return f'<Observacao Ordem {self.id_ordem}: {self.observacao[:20]}...>'
