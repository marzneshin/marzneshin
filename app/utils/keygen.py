# import hashlib
import xxhash
import uuid
from app.models.proxy import ProxyTypes


def gen_uuid(key: str) -> str:
    return str(uuid.UUID(bytes=xxhash.xxh128(key.encode()).digest()))


def gen_password(key: str) -> str:
    return xxhash.xxh128(key.encode()).hexdigest()
