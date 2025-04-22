import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')


def verificar_permissao(token, permissoes_permitidas):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        usuario_permissao = payload['permissao']
        if usuario_permissao in permissoes_permitidas:
            return True
        else:
            return False
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
