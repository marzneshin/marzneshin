import json
from enum import Enum
from typing import Optional, Union, List
# from uuid import UUID, uuid4

from pydantic import ConfigDict, BaseModel, Field, validator


# from app.utils.system import random_password
from xray_api.types.account import (
    ShadowsocksAccount,
    ShadowsocksMethods,
    TrojanAccount,
    VLESSAccount,
    VMessAccount,
    XTLSFlows,
)


class ProxyTypes(str, Enum):
    # proxy_type = protocol

    VMess = "vmess"
    VLESS = "vless"
    Trojan = "trojan"
    Shadowsocks = "shadowsocks"

    @property
    def account_model(self):
        if self == self.VMess:
            return VMessAccount
        if self == self.VLESS:
            return VLESSAccount
        if self == self.Trojan:
            return TrojanAccount
        if self == self.Shadowsocks:
            return ShadowsocksAccount

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


class InboundHost(BaseModel):
    remark: str
    address: str
    port: Optional[int] = Field(None, nullable=True)
    sni: Optional[str] = Field(None, nullable=True)
    host: Optional[str] = Field(None, nullable=True)
    path: Optional[str] = Field(None, nullable=True)
    security: InboundHostSecurity = InboundHostSecurity.inbound_default
    alpn: InboundHostALPN = InboundHostALPN.none
    fingerprint: InboundHostFingerprint = InboundHostFingerprint.none
    allowinsecure: Union[bool, None] = None
    is_disabled: Union[bool, None] = None
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


class InboundBase(BaseModel):
    id: Optional[int] = Field(None)
    tag: str = Field()
    protocol: ProxyTypes = Field()
    node_id: Optional[int] = Field(None)
    model_config = ConfigDict(from_attributes=True)

from app.models.service import ServiceBase
from app.models.node import NodeBase

class Inbound(InboundBase):
    services: Optional[List[ServiceBase]] = None
    node: Optional[NodeBase] = None
