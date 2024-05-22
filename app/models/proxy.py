import json
from enum import Enum
from typing import Optional, Union, List

from pydantic import ConfigDict, BaseModel, Field, validator


class XTLSFlows(Enum):
    NONE = ""
    VISION = "xtls-rprx-vision"


class ShadowsocksMethods(Enum):
    AES_128_GCM = "aes-128-gcm"
    AES_256_GCM = "aes-256-gcm"
    CHACHA20_POLY1305 = "chacha20-ietf-poly1305"


class ProxyTypes(str, Enum):
    # proxy_type = protocol

    VMess = "vmess"
    VLESS = "vless"
    Trojan = "trojan"
    Shadowsocks = "shadowsocks"

    @property
    def settings_model(self):
        if self == self.VMess:
            return VMessSettings
        if self == self.VLESS:
            return VLESSSettings
        if self == self.Trojan:
            return TrojanSettings
        if self == self.Shadowsocks:
            return ShadowsocksSettings


class ProxySettings(BaseModel):
    @classmethod
    def from_dict(cls, proxy_type: ProxyTypes, _dict: dict):
        return ProxyTypes(proxy_type).settings_model.parse_obj(_dict)

    def dict(self, *, no_obj=False, **kwargs):
        if no_obj:
            return json.loads(self.json())
        return super().dict(**kwargs)


class VMessSettings(ProxySettings):
    id: str = Field(nullable=False)


class VLESSSettings(ProxySettings):
    id: str = Field(nullable=False)
    flow: XTLSFlows = XTLSFlows.NONE


class TrojanSettings(ProxySettings):
    password: str = Field(nullable=False)


class ShadowsocksSettings(ProxySettings):
    password: str = Field(nullable=False)
    method: ShadowsocksMethods = ShadowsocksMethods.CHACHA20_POLY1305


class InboundHostSecurity(str, Enum):
    inbound_default = "inbound_default"
    none = "none"
    tls = "tls"


InboundHostALPN = Enum(
    "ProxyHostALPN",
    {
        "none": "",
        "h2": "h2",
        "http/1.1": "http/1.1",
        "h2,http/1.1": "h2,http/1.1",
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
    port: Optional[int] = Field(None)
    sni: Optional[str] = Field(None)
    host: Optional[str] = Field(None)
    path: Optional[str] = Field(None)
    security: InboundHostSecurity = InboundHostSecurity.inbound_default
    alpn: InboundHostALPN = InboundHostALPN.none
    fingerprint: InboundHostFingerprint = InboundHostFingerprint.none
    allowinsecure: Union[bool, None] = None
    is_disabled: Union[bool, None] = None
    mux: bool = Field(False)
    fragment: Optional[FragmentSettings] = Field(None)
    model_config = ConfigDict(from_attributes=True)

    # TODO[pydantic]: We couldn't refactor the `validator`, please replace it by `field_validator` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-validators for more information.
    @validator("remark", pre=False, always=True)
    def validate_remark(cls, v):
        try:
            v.format_map(FormatVariables())
        except ValueError as exc:
            raise ValueError("Invalid formatting variables")

        return v

    # TODO[pydantic]: We couldn't refactor the `validator`, please replace it by `field_validator` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-validators for more information.
    @validator("address", pre=False, always=True)
    def validate_address(cls, v):
        try:
            v.format_map(FormatVariables())
        except ValueError as exc:
            raise ValueError("Invalid formatting variables")

        return v

    # TODO[pydantic]: We couldn't refactor the `validator`, please replace it by `field_validator` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-validators for more information.
    @validator("path", pre=False, always=True)
    def validate_path(cls, v):
        if not v:
            return v
        try:
            v.format_map(FormatVariables())
        except ValueError:
            raise ValueError("Invalid formatting variables")

        return v


class InboundHostResponse(InboundHost):
    id: int


class InboundBase(BaseModel):
    id: Optional[int] = Field(None)
    tag: str = Field()
    protocol: ProxyTypes = Field()
    config: str
    node_id: Optional[int] = Field(None)
    model_config = ConfigDict(from_attributes=True)


from app.models.service import ServiceBase
from app.models.node import NodeBase


class Inbound(InboundBase):
    services: Optional[List[ServiceBase]] = None
    node: Optional[NodeBase] = None
