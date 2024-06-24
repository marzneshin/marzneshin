import secrets
from datetime import datetime, timedelta
from enum import Enum
from typing import Annotated

from pydantic import (
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
    ACTIVE = "active"
    INACTIVE = "inactive"


class UserDataUsageResetStrategy(str, Enum):
    no_reset = "no_reset"
    day = "day"
    week = "week"
    month = "month"
    year = "year"


class UserExpireStrategy(str, Enum):
    NEVER = "never"
    FIXED_DATE = "fixed_date"
    START_ON_FIRST_USE = "start_on_first_use"


class User(BaseModel):
    id: int | None = None
    username: Annotated[
        str, StringConstraints(to_lower=True, pattern=USERNAME_REGEXP)
    ]
    expire_strategy: UserExpireStrategy
    expire_date: datetime | None = Field(None)
    usage_duration: timedelta | None = Field(None)
    activation_deadline: datetime | None = Field(None)
    key: str = Field(default_factory=lambda: secrets.token_hex(16))
    data_limit: int | None = Field(
        ge=0, default=None, description="data_limit can be 0 or greater"
    )
    enabled: bool = Field(default=True)
    data_limit_reset_strategy: UserDataUsageResetStrategy = (
        UserDataUsageResetStrategy.no_reset
    )
    note: Annotated[str, Field(max_length=500)] | None = None
    sub_updated_at: datetime | None = Field(None)
    sub_last_user_agent: str | None = Field(None)
    online_at: datetime | None = Field(None)

    model_config = ConfigDict(from_attributes=True)


class UserCreate(User):
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
        if self.expire_strategy == UserExpireStrategy.START_ON_FIRST_USE:
            if not self.usage_duration:
                raise ValueError(
                    "User expire_strategy can not be start_on_first_use without a valid usage_duration."
                )
        elif (
            self.expire_strategy == UserExpireStrategy.FIXED_DATE
            and not self.expire_date
        ):
            raise ValueError(
                "User expire_strategy can not be fixed_date without a valid expire date."
            )
        return self


class UserModify(UserCreate):
    service_ids: list[int] | None = Field(None)
    data_limit_reset_strategy: UserDataUsageResetStrategy | None = Field(None)
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
    node_id: int | None = None
    node_name: str
    used_traffic: int


class UserUsagesResponse(BaseModel):
    username: str
    usages: list[UserUsageResponse]
