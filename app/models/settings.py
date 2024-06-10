from enum import Enum
from typing import Pattern

from pydantic import BaseModel


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


class SubscriptionSettings(BaseModel):
    url_prefix: str
    profile_title: str
    support_link: str
    update_interval: int
    rules: list[SubscriptionRule]


class TelegramSettings(BaseModel):
    token: str
    admin_id: list[int]
    channel_id: int | None


class Settings(BaseModel):
    subscription: SubscriptionSettings
    telegram: TelegramSettings | None
