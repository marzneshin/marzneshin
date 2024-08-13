import xxhash
import uuid
from app.config.env import AuthAlgorithm, AUTH_GENERATION_ALGORITHM


def gen_uuid(key: str) -> str:
    if AUTH_GENERATION_ALGORITHM == AuthAlgorithm.PLAIN:
        return str(uuid.UUID(key))
    else:
        return str(uuid.UUID(bytes=xxhash.xxh128(key.encode()).digest()))


def gen_password(key: str) -> str:
    if AUTH_GENERATION_ALGORITHM == AuthAlgorithm.PLAIN:
        return key
    else:
        return xxhash.xxh128(key.encode()).hexdigest()
