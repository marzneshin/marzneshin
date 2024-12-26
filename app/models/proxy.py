from enum import Enum

from pydantic import ConfigDict, BaseModel, Field, field_validator

from app.models.node import Node


class ProxyTypes(str, Enum):
    # proxy_type = protocol
    VMess = "vmess"
    VLESS = "vless"
    Trojan = "trojan"
    Shadowsocks = "shadowsocks"
    Shadowsocks2022 = "shadowsocks2022"
    Hysteria2 = "hysteria2"
    WireGuard = "wireguard"
    TUIC = "tuic"
    ShadowTLS = "shadowtls"


class InboundHostSecurity(str, Enum):
    inbound_default = "inbound_default"
    none = "none"
    tls = "tls"


InboundHostALPN = Enum(
    "ProxyHostALPN",
    {
        "none": "none",
        "h2": "h2",
        "http/1.1": "http/1.1",
        "h2,http/1.1": "h2,http/1.1",
        "h3": "h3",
        "h3,h2": "h3,h2",
        "h3,h2,http/1.1": "h3,h2,http/1.1",
    },
)


InboundHostFingerprint = Enum(
    "ProxyHostFingerprint",
    {
        "none": "",
        "chrome": "chrome",
        "firefox": "firefox",
        "safari": "safari",
        "ios": "ios",
        "android": "android",
        "edge": "edge",
        "360": "360",
        "qq": "qq",
        "random": "random",
        "randomized": "randomized",
    },
)


class FormatVariables(dict):
    def __missing__(self, key):
        return key.join("{}")


class FragmentSettings(BaseModel):
    packets: str = Field(pattern=r"^(:?tlshello|[\d-]{1,32})$")
    length: str = Field(pattern=r"^[\d-]{1,32}$")
    interval: str = Field(pattern=r"^[\d-]{1,32}$")


class XrayNoise(BaseModel):
    type: str = Field(pattern=r"^(:?rand|str|base64)$")
    packet: str = Field()
    delay: str = Field(pattern=r"^\d{1,10}(-\d{1,10})?$")


class XMuxSettings(BaseModel):
    max_concurrency: str | None = Field(
        None, pattern=r"^\d{1,10}(-\d{1,10})?$"
    )
    max_connections: str | None = Field(
        None, pattern=r"^\d{1,10}(-\d{1,10})?$"
    )
    max_reuse_times: str | None = Field(
        None, pattern=r"^\d{1,10}(-\d{1,10})?$"
    )
    max_lifetime: str | None = Field(None, pattern=r"^\d{1,10}(-\d{1,10})?$")
    max_request_times: str | None = Field(None)
    keep_alive_period: int | None = Field(None)


class SplitHttpSettings(BaseModel):
    mode: str | None = None
    no_grpc_header: bool | None = None
    padding_bytes: str | None = None
    xmux: XMuxSettings | None = None


class SingBoxMuxSettings(BaseModel):
    max_connections: int | None = Field(None)
    max_streams: int | None = Field(None)
    min_streams: int | None = Field(None)
    padding: bool | None = Field(None)


class MuxCoolSettings(BaseModel):
    concurrency: int | None = None
    xudp_concurrency: int | None = None
    xudp_proxy_443: str | None = None


class MuxSettings(BaseModel):
    protocol: str
    sing_box_mux_settings: SingBoxMuxSettings | None = None
    mux_cool_settings: MuxCoolSettings | None = None


class InboundHost(BaseModel):
    remark: str
    address: str
    uuid: str | None = None
    password: str | None = None
    protocol: ProxyTypes | str | None = None
    network: str | None = None
    port: int | None = Field(None)
    sni: str | None = Field(None)
    host: str | None = Field(None)
    path: str | None = Field(None)
    security: InboundHostSecurity = InboundHostSecurity.inbound_default
    alpn: InboundHostALPN = InboundHostALPN.none
    fingerprint: InboundHostFingerprint = InboundHostFingerprint.none
    allowinsecure: bool | None = False
    is_disabled: bool | None = False
    fragment: FragmentSettings | None = Field(None)
    noise: list[XrayNoise] | None = None
    http_headers: dict[str, str] | None = Field(default_factory=dict)
    mtu: int | None = None
    dns_servers: str | None = None
    allowed_ips: str | None = None
    header_type: str | None = None
    reality_public_key: str | None = None
    reality_short_ids: list[str] | None = None
    flow: str | None = None
    shadowtls_version: int | None = None
    shadowsocks_method: str | None = None
    splithttp_settings: SplitHttpSettings | None = None
    early_data: int | None = None
    mux_settings: MuxSettings | None = None
    universal: bool = False
    service_ids: list[int] = Field(default_factory=list)
    weight: int = 1
    inbound_id: int | None = None
    chain_ids: list[int] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("remark", "address", "path")
    @classmethod
    def validate_fmt_variables(cls, v: str) -> str:
        if not v:
            return v

        v.format_map(FormatVariables())

        return v

    @field_validator("alpn", mode="before")
    @classmethod
    def validate_alpn(cls, v):
        if not v:
            return InboundHostALPN.none
        return v


class InboundHostResponse(InboundHost):
    id: int


class Inbound(BaseModel):
    id: int
    tag: str
    protocol: ProxyTypes
    config: str
    node: Node
    service_ids: list[int]
    model_config = ConfigDict(from_attributes=True)
