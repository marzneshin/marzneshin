from enum import Enum

from pydantic import ConfigDict, BaseModel, Field, field_validator

from app.models.node import Node


class ProxyTypes(str, Enum):
    # proxy_type = protocol
    VMess = "vmess"
    VLESS = "vless"
    Trojan = "trojan"
    Shadowsocks = "shadowsocks"


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


class InboundHost(BaseModel):
    remark: str
    address: str
    port: int | None = Field(None)
    sni: str | None = Field(None)
    host: str | None = Field(None)
    path: str | None = Field(None)
    security: InboundHostSecurity = InboundHostSecurity.inbound_default
    alpn: InboundHostALPN = InboundHostALPN.none
    fingerprint: InboundHostFingerprint = InboundHostFingerprint.none
    allowinsecure: bool | None = None
    is_disabled: bool | None = None
    mux: bool = Field(False)
    fragment: FragmentSettings | None = Field(None)
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
