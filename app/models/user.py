import secrets
from datetime import datetime
from enum import Enum
from typing import List, Optional, Union, Annotated, Literal

from pydantic import (
    field_validator,
    ConfigDict,
    BaseModel,
    Field,
    computed_field,
    StringConstraints,
    model_validator,
)

from config import SUBSCRIPTION_URL_PREFIX

USERNAME_REGEXP = r"^\w{3,32}$"


class ReminderType(str, Enum):
    expiration_date = "expiration_date"
    data_usage = "data_usage"


class UserStatus(str, Enum):
    active = "active"
    on_hold = "on_hold"
    limited = "limited"
    expired = "expired"


class UserStatusModify(str, Enum):
    active = "active"
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
    id: Optional[int] = None
    username: Annotated[str, StringConstraints(to_lower=True, pattern=USERNAME_REGEXP)]
    expire: Union[datetime, None, Literal[0]] = Field(None)
    key: str = Field(default_factory=lambda: secrets.token_hex(16))
    data_limit: Optional[int] = Field(
        ge=0, default=None, description="data_limit can be 0 or greater"
    )
    enabled: bool = Field(default=True)
    data_limit_reset_strategy: UserDataLimitResetStrategy = (
        UserDataLimitResetStrategy.no_reset
    )
    note: Optional[Annotated[str, Field(max_length=500)]] = None
    sub_updated_at: Optional[datetime] = Field(None)
    sub_last_user_agent: Optional[str] = Field(None)
    online_at: Optional[datetime] = Field(None)
    on_hold_expire_duration: Optional[int] = Field(None)
    on_hold_timeout: Optional[datetime] = Field(None)

    model_config = ConfigDict(from_attributes=True)


from app.models.service import ServiceBase
from app.models.proxy import InboundBase


class User(UserBase):
    pass


class UserCreate(User):
    status: UserStatusCreate = Field(UserStatusCreate.active)
    services: List[int] = Field([])
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "user1234",
                "services": [1, 2, 3],
                "expire": "2023-11-03T20:30:00",
                "data_limit": 0,
                "data_limit_reset_strategy": "no_reset",
                "status": "active",
                "note": "",
                "on_hold_timeout": "2023-11-03T20:30:00",
                "on_hold_expire_duration": 0,
            }
        }
    )

    @model_validator(mode="after")
    def validate_expiry(self):
        if self.status == UserStatusCreate.on_hold:
            if not self.on_hold_expire_duration:
                raise ValueError(
                    "User cannot be on hold without a valid on_hold_expire_duration."
                )
            if self.expire:
                raise ValueError("User cannot be on hold with specified expire.")
        elif self.status == UserStatusCreate.active and (
            self.on_hold_expire_duration or self.on_hold_timeout
        ):
            raise ValueError("on hold parametrs set when user status isn't on_hold.")
        return self

    @field_validator("expire")
    @classmethod
    def validate_expire(cls, v: Union[datetime, None, Literal[0]]):
        if isinstance(v, datetime) and (v.tzinfo is not None):
            raise ValueError(
                "Expire date should be offset naive, and preferably in utc timezone."
            )
        if isinstance(v, datetime) and v < datetime.utcnow():
            raise ValueError("Expire date should be in the future, not in the past.")
        return v


class UserModify(User):
    status: Optional[UserStatusModify] = Field(None)
    services: List[int] = Field([])
    data_limit_reset_strategy: Optional[UserDataLimitResetStrategy] = Field(None)
    model_config = ConfigDict(
        json_schema_extra={
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
        }
    )

    @model_validator(mode="after")
    def validate_expiry(self):
        if self.on_hold_expire_duration and self.expire:
            raise ValueError(
                "can't set both expire and on hold expire at the same time."
            )
        return self

    @field_validator("expire")
    @classmethod
    def validate_expire(cls, v: Union[datetime, None, Literal[0]]):
        if isinstance(v, datetime) and v.tzinfo is not None:
            raise ValueError(
                "Expire date should be offset naive, and preferably in utc timezone."
            )
        if isinstance(v, datetime) and v < datetime.utcnow():
            raise ValueError("Expire date should be in the future, not in the past.")
        return v


class UserResponse(User):
    id: int
    status: UserStatus
    used_traffic: int
    lifetime_used_traffic: int = 0
    created_at: datetime
    inbounds: List[InboundBase] = Field([])
    services: List[ServiceBase] = Field([])
    links: List[str] | None = []  # Field(None)

    # subscription_url: str = ""
    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def service_ids(self) -> List[int]:
        return [s.id for s in self.services]

    @computed_field
    @property
    def subscription_url(self) -> str:
        salt = secrets.token_hex(8)
        url_prefix = SUBSCRIPTION_URL_PREFIX.replace("*", salt)
        return f"{url_prefix}/sub/{self.username}/{self.key}"


class UserUsageResponse(BaseModel):
    node_id: Union[int, None] = None
    node_name: str
    used_traffic: int


class UserUsagesResponse(BaseModel):
    username: str
    usages: List[UserUsageResponse]
