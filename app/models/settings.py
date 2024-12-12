from enum import Enum
from typing import Pattern

from pydantic import BaseModel, Field, validator
from .user import UserResponse


class ConfigTypes(str, Enum):
    links = "links"
    base64_links = "base64-links"
    xray = "xray"
    sing_box = "sing-box"
    clash = "clash"
    clash_meta = "clash-meta"
    template = "template"
    block = "block"


class SubscriptionRule(BaseModel):
    pattern: Pattern
    result: ConfigTypes


class PlaceholderTypes(str, Enum):
    ALL = "all"
    DISABLE = "disable"
    EXPIRED = "expired"
    LIMITED = "limited"

    @classmethod
    def get_active_types(
        cls, user: "UserResponse"
    ) -> list["PlaceholderTypes"]:
        active_types = []
        if user.expired:
            active_types.append(cls.EXPIRED)
        if user.data_limit and user.used_traffic > user.data_limit:
            active_types.append(cls.LIMITED)
        return active_types or [cls.DISABLE]


class PlaceholderRule(BaseModel):
    placetype: PlaceholderTypes
    texts: list[str]


class SubscriptionSettings(BaseModel):
    template_on_acceptance: bool
    profile_title: str
    support_link: str
    update_interval: int
    shuffle_configs: bool = False
    placeholder_if_disabled: bool = True
    placeholder_remarks: list[PlaceholderRule] = Field(
        example=[
            {
                "placetype": "disable",
                "texts": ["Service is disabled.", "Contact support."],
            }
        ]
    )
    rules: list[SubscriptionRule]

    @validator("placeholder_remarks")
    def validate_unique_placetype(cls, value):

        placetypes = [rule.placetype for rule in value]
        if len(placetypes) != len(set(placetypes)):
            raise ValueError("Duplicate 'placetype' values are not allowed.")

        return value


class TelegramSettings(BaseModel):
    token: str
    admin_id: list[int]
    channel_id: int | None


class Settings(BaseModel):
    subscription: SubscriptionSettings
    telegram: TelegramSettings | None
