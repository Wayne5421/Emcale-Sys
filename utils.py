import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def verificar_permissao(token, permissoes_permitidas):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        usuario_permissao = payload.get('permissao')
        
        if usuario_permissao and usuario_permissao in permissoes_permitidas:
            return True
        return False
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return False
