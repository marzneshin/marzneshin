import secrets
from datetime import datetime
from enum import Enum
from typing import List, Union, Annotated, Literal

from pydantic import (
    field_validator,
    ConfigDict,
    BaseModel,
    Field,
    computed_field,
    StringConstraints,
    model_validator,
)

from app.config.env import SUBSCRIPTION_URL_PREFIX

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


class User(BaseModel):
    id: int | None = None
    username: Annotated[
        str, StringConstraints(to_lower=True, pattern=USERNAME_REGEXP)
    ]
    expire: Union[datetime, None, Literal[0]] = Field(None)
    key: str = Field(default_factory=lambda: secrets.token_hex(16))
    data_limit: int | None = Field(
        ge=0, default=None, description="data_limit can be 0 or greater"
    )
    enabled: bool = Field(default=True)
    data_limit_reset_strategy: UserDataLimitResetStrategy = (
        UserDataLimitResetStrategy.no_reset
    )
    note: Annotated[str, Field(max_length=500)] | None = None
    sub_updated_at: datetime | None = Field(None)
    sub_last_user_agent: str | None = Field(None)
    online_at: datetime | None = Field(None)
    on_hold_expire_duration: int | None = Field(None)
    on_hold_timeout: datetime | None = Field(None)

    model_config = ConfigDict(from_attributes=True)


class UserCreate(User):
    status: UserStatusCreate = Field(UserStatusCreate.active)
    service_ids: list[int] = Field([])
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
                raise ValueError(
                    "User cannot be on hold with specified expire."
                )
        elif self.status == UserStatusCreate.active and (
            self.on_hold_expire_duration or self.on_hold_timeout
        ):
            raise ValueError(
                "on hold parameters set when user status isn't on_hold."
            )
        return self

    @field_validator("expire")
    @classmethod
    def validate_expire(cls, v: Union[datetime, None, Literal[0]]):
        if isinstance(v, datetime) and (v.tzinfo is not None):
            raise ValueError(
                "Expire date should be offset naive, and preferably in utc timezone."
            )
        if isinstance(v, datetime) and v < datetime.utcnow():
            raise ValueError(
                "Expire date should be in the future, not in the past."
            )
        return v


class UserModify(User):
    status: UserStatusModify | None = Field(None)
    service_ids: list[int] | None = Field(None)
    data_limit_reset_strategy: UserDataLimitResetStrategy | None = Field(None)
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
            raise ValueError(
                "Expire date should be in the future, not in the past."
            )
        return v


class UserResponse(User):
    id: int
    status: UserStatus
    used_traffic: int
    lifetime_used_traffic: int = 0
    created_at: datetime
    service_ids: list[int]

    model_config = ConfigDict(from_attributes=True)

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
