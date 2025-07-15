from extensions import db

class Material(db.Model):
    __tablename__ = 'materiais'

    id        = db.Column(db.Integer, primary_key=True)
    material  = db.Column(db.Text, nullable=False)
    id_ordem  = db.Column(db.Integer,
                          db.ForeignKey('ordens_servico.id', ondelete='CASCADE'),
                          nullable=False)

    ordem = db.relationship('OrdemServico', backref='materiais')

    def __repr__(self):
        return f'<Material Ordem {self.id_ordem}: {self.material[:20]}…>'
