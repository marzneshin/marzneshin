# import hashlib
import xxhash
import uuid
from app.models.proxy import ProxyTypes


def gen_uuid(key: str) -> str:
    return str(uuid.UUID(bytes=xxhash.xxh128(key.encode()).digest()))


def gen_password(key: str) -> str:
    return xxhash.xxh128(key.encode()).hexdigest()


def generate_settings(key: str, protocol: ProxyTypes) -> dict:
    if protocol in (ProxyTypes.Trojan, ProxyTypes.Shadowsocks):
        return (
            ProxyTypes(protocol)
            .settings_model(password=gen_password(key))
            .dict(no_obj=True)
        )
    elif protocol in (ProxyTypes.VMess, ProxyTypes.VLESS):
        return ProxyTypes(protocol).settings_model(id=gen_uuid(key)).dict(no_obj=True)
