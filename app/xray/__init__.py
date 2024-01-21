from random import randint
from typing import TYPE_CHECKING, Dict, Sequence

from app.models.proxy import InboundHostSecurity
from app.utils.store import DictStorage
from app.utils.system import check_port
from app.xray import operations
from app.xray.config import XRayConfig
from app.xray.core import XRayCore
from app.xray.node import XRayNode
from config import XRAY_ASSETS_PATH, XRAY_EXECUTABLE_PATH, XRAY_JSON
from xray_api import XRay as XRayAPI
from xray_api import exceptions
from xray_api import exceptions as exc
from xray_api import types


core = XRayCore(XRAY_EXECUTABLE_PATH, XRAY_ASSETS_PATH)
configs: Dict[int, XRayConfig] = {}

# Search for a free API port
try:
    for api_port in range(randint(10000, 60000), 65536):
        if not check_port(api_port):
            break
finally:
    configs[0] = XRayConfig(XRAY_JSON, api_port=api_port)
    del api_port

api = XRayAPI(configs[0].api_host, configs[0].api_port)

nodes: Dict[int, XRayNode] = {}


if TYPE_CHECKING:
    from app.db.models import InboundHost

"""
@DictStorage
def hosts(storage: dict):
    from app.db import GetDB, crud

    storage.clear()
    with GetDB() as db:
        for inbound_id, node_id in config.inbounds_by_id:
            inbound_hosts: Sequence[InboundHost] = crud.get_hosts(db, inbound_)

            storage[inbound_tag] = [
                {
                    "remark": host.remark,
                    "address": host.address,
                    "port": host.port,
                    "path": host.path if host.path else None,
                    "sni": [i.strip() for i in host.sni.split(',')] if host.sni else [],
                    "host": [i.strip() for i in host.host.split(',')] if host.host else [],
                    "alpn": host.alpn.value,
                    "fingerprint": host.fingerprint.value,
                    # None means the tls is not specified by host itself and
                    #  complies with its inbound's settings.
                    "tls": None
                    if host.security == InboundHostSecurity.inbound_default
                    else host.security.value,
                    "allowinsecure":host.allowinsecure,
                } for host in inbound_hosts if not host.is_disabled
            ]

"""

__all__ = [
    "configs",
    "hosts",
    "core",
    "api",
    "nodes",
    "operations",
    "exceptions",
    "exc",
    "types",
    "XRayConfig",
    "XRayCore",
    "XRayNode",
]
