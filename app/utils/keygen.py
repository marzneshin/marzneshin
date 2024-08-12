import xxhash
import uuid
from app.config.env import config

def gen_uuid(key: str) -> str:
    if config.REVERSIBLE_KEY:
        return str(uuid.UUID(key))
    else:
        return str(uuid.UUID(bytes=xxhash.xxh128(key.encode()).digest()))


def gen_password(key: str) -> str:
    if config.REVERSIBLE_KEY:
        return key
    else:
        return xxhash.xxh128(key.encode()).hexdigest()
