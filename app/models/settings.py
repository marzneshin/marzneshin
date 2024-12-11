from enum import Enum
from typing import Pattern

from pydantic import BaseModel, Field, validator


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
    DISABLE = "disable"
    EXPIRED = "expired"
    LIMITED = "limited"


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
