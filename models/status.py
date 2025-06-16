from extensions import db

class Status(db.Model):
    __tablename__ = 'status'

    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Status {self.descricao}>'
