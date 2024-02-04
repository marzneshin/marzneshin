import re
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union
import random
import secrets

from pydantic import field_validator, ConfigDict, BaseModel, Field, validator, computed_field, ValidationInfo

from app import xray
from app.models.proxy import ProxySettings, ProxyTypes, InboundBase
from app.utils.jwt import create_subscription_token

from config import XRAY_SUBSCRIPTION_PATH, XRAY_SUBSCRIPTION_URL_PREFIX

USERNAME_REGEXP = re.compile(r"^(?=\w{3,32}\b)[a-zA-Z0-9-_@.]+(?:_[a-zA-Z0-9-_@.]+)*$")


class ReminderType(str, Enum):
    expiration_date = "expiration_date"
    data_usage = "data_usage"


class UserStatus(str, Enum):
    active = "active"
    disabled = "disabled"
    limited = "limited"
    expired = "expired"
    on_hold = "on_hold"

from app.utils.share import generate_v2ray_links

class UserStatusModify(str, Enum):
    active = "active"
    disabled = "disabled"
    on_hold = "on_hold"


class UserStatusCreate(str, Enum):
    active = "active"
    on_hold = "on_hold"


class UserDataLimitResetStrategy(str, Enum):
    no_reset = "no_reset"
    day = "day"
    week = "week"
    month = "month"
    year = "year"


class UserBase(BaseModel):
    # proxies: Dict[ProxyTypes, ProxySettings] = {}
    id: Optional[int] = None
    username: str
    expire: Optional[int] = Field(None, nullable=True)
    key: str = Field(default_factory=lambda: secrets.token_hex(16))
    data_limit: Optional[int] = Field(
        ge=0, default=None, description="data_limit can be 0 or greater"
    )
    data_limit_reset_strategy: UserDataLimitResetStrategy = (
        UserDataLimitResetStrategy.no_reset
    )
    # inbounds: Dict[ProxyTypes, List[str]] = {}
    note: Optional[str] = Field(None, nullable=True)
    sub_updated_at: Optional[datetime] = Field(None, nullable=True)
    sub_last_user_agent: Optional[str] = Field(None, nullable=True)
    online_at: Optional[datetime] = Field(None, nullable=True)
    on_hold_expire_duration: Optional[int] = Field(None, nullable=True)
    on_hold_timeout: Optional[Union[datetime, None]] = Field(None, nullable=True)

    
    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str):
        if not USERNAME_REGEXP.match(v):
            raise ValueError(
                "Username only can be 3 to 32 characters and contain a-z, 0-9, and underscores in between."
            )
        return v

    @field_validator("note")
    @classmethod
    def validate_note(cls, v: str):
        if v and len(v) > 500:
            raise ValueError("User's note can be a maximum of 500 character")
        return v

    @field_validator("on_hold_expire_duration", "on_hold_timeout", check_fields=False)
    @classmethod
    def validate_timeout(cls, v: Optional[int]):
        # Check if expire is 0 or None and timeout is not 0 or None
        if (v in (0, None)):
            return None
        return v
    model_config = ConfigDict(from_attributes=True)

from app.models.service import ServiceBase

class User(UserBase): 
    pass


class UserCreate(User):
    status: UserStatusCreate = Field(None, validate_default=True)
    services: List[int] = Field([])
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "username": "user1234",
            "services": [1, 2, 3],
            "expire": 0,
            "data_limit": 0,
            "data_limit_reset_strategy": "no_reset",
            "status": "active",
            "note": "",
            "on_hold_timeout": "2023-11-03T20:30:00",
            "on_hold_expire_duration": 0,
        }
    })

    # TODO[pydantic]: We couldn't refactor the `validator`, please replace it by `field_validator` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-validators for more information.
    #@validator("status", pre=True, always=True)
    #def validate_status(cls, value):
        
    # TODO[pydantic]: We couldn't refactor the `validator`, please replace it by `field_validator` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-validators for more information.
    @field_validator("status", mode="before")
    def validate_status(cls, status: str, info: ValidationInfo) -> str:
        if not status or status not in UserStatusCreate.__members__:
            return UserStatusCreate.active  # Set to the default if not valid
        on_hold_expire = info.data.get("on_hold_expire_duration")
        expire = info.data.get("expire")
        if status == UserStatusCreate.on_hold:
            if (on_hold_expire == 0 or on_hold_expire is None):
                raise ValueError("User cannot be on hold without a valid on_hold_expire_duration.")
            if expire:
                raise ValueError("User cannot be on hold with specified expire.")
        return status


class UserModify(User):
    status: Optional[UserStatusModify] = Field(None)
    services: List[int] = Field([])
    data_limit_reset_strategy: Optional[UserDataLimitResetStrategy] = Field(None)
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "username": "mammad1234",
            "services": [1, 2, 3],
            "expire": 0,
            "data_limit": 0,
            "data_limit_reset_strategy": "no_reset",
            "status": "active",
            "note": "",
            "on_hold_timeout": "2023-11-03T20:30:00",
            "on_hold_expire_duration": 0,
        }
    })
    

    # TODO[pydantic]: We couldn't refactor the `validator`, please replace it by `field_validator` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-validators for more information.
    @validator("status", pre=True, always=True)
    def validate_status(cls, status, values):
        on_hold_expire = values.get("on_hold_expire_duration")
        expire = values.get("expire")
        if status == UserStatusCreate.on_hold:
            if not on_hold_expire:
                raise ValueError("User cannot be on hold without a valid on_hold_expire_duration.")
            if expire:
                raise ValueError("User cannot be on hold with specified expire.")
        return status


class UserResponse(User):
    id: int
    status: UserStatus
    used_traffic: int
    lifetime_used_traffic: int = 0
    created_at: datetime
    inbounds: List[InboundBase] = Field([])
    services: List[ServiceBase] = Field([])

    # links: List[str] = [] # Field(default_factory=lamba x: )
    # subscription_url: str = ""
    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def service_ids(self) -> List[int]:
        return [s.id for s in self.services]


    @computed_field
    @property
    def links(self) -> List[str]:
        return generate_v2ray_links(
                inbounds=self.inbounds, key=self.key, extra_data=self.dict(exclude={'subscription_url', 'links'})
                )

    @computed_field
    @property
    def subscription_url(self) -> str:
        salt = secrets.token_hex(8)
        url_prefix = (XRAY_SUBSCRIPTION_URL_PREFIX).replace('*', salt)
        token = create_subscription_token(self.username)
        return f"{url_prefix}/{XRAY_SUBSCRIPTION_PATH}/{token}"
    

class UsersResponse(BaseModel): 
    total: int
    users: List[UserResponse]


class UserUsageResponse(BaseModel):
    node_id: Union[int, None] = None
    node_name: str
    used_traffic: int


class UserUsagesResponse(BaseModel):
    username: str
    usages: List[UserUsageResponse]
