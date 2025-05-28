from extensions import db

class OrdemServico(db.Model):
    __tablename__ = 'ordens_servico'

    id = db.Column(db.Integer, primary_key=True)
    wo_projeto = db.Column(db.String(50), nullable=False)
    cidade = db.Column(db.String(100))
    regional = db.Column(db.String(100))
    escopo = db.Column(db.Text)
    premissas = db.Column(db.Text)
    data_abertura = db.Column(db.Date, default=db.func.current_date())
    prazo = db.Column(db.Date)

    id_tecnico = db.Column(db.Integer, db.ForeignKey('tecnicos.id'))

    def __repr__(self):
        return f'<OrdemServico {self.wo_projeto}>'
