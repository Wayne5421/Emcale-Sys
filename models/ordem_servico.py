from extensions import db

# Importar Status somente dentro do método para evitar circularidade:
# (Ou importe Status fora do arquivo se não causar problema)

class OrdemServico(db.Model):
    __tablename__ = 'ordens_servico'

    id = db.Column(db.Integer, primary_key=True)
    wo_projeto = db.Column(db.String(50), nullable=False)
    cidade = db.Column(db.String(100))
    regional = db.Column(db.String(100))
    escopo = db.Column(db.Text)
    premissas = db.Column(db.Text)
    data_abertura = db.Column(db.Date, default=db.func.current_date())
    prazo_desktop = db.Column(db.Date)
    prazo_tecnico = db.Column(db.Date)

    id_tecnico = db.Column(db.Integer, db.ForeignKey('tecnicos.id'))
    id_status = db.Column(db.Integer, db.ForeignKey('status.id'))

    # Importação tardia aqui para evitar erro:
    # Você pode usar uma string com o nome da classe dentro do relationship
    status = db.relationship('Status', backref='ordens_servico')

    def __repr__(self):
        return f'<OrdemServico {self.wo_projeto}>'
