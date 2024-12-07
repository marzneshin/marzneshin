from datetime import datetime
from typing import Optional, Annotated
from pydantic import (
    BaseModel,
    StringConstraints,
    Field
)
from app.models.user import UserExpireStrategy, UserDataUsageResetStrategy, USERNAME_REGEXP


class Template(BaseModel):
    name: Optional[str] = None
    prefix: Annotated[
        Optional[str],
        StringConstraints(to_lower=True, pattern=USERNAME_REGEXP),
    ] = None
    suffix: Annotated[
        Optional[str],
        StringConstraints(to_lower=True, pattern=USERNAME_REGEXP),
    ] = None
    data_limit: Optional[int] = Field(
        ge=0, default=None, description="Data limit must be 0 or greater."
    )
    data_limit_reset_strategy: UserDataUsageResetStrategy = UserDataUsageResetStrategy.no_reset
    expire_strategy: Optional[UserExpireStrategy] = None
    expire_date: Optional[int] = None
    usage_duration: Optional[int] = None
    activation_deadline: Optional[int] = None
    reset_data_usage: Optional[bool] = None

    class Config:
        orm_mode = True
        json_schema_extra = {
            "examples": [
                {
                    "name": "Example Template",
                    "prefix": "user_",
                    "suffix": "_01",
                    "data_limit": 1548124875,
                    "data_limit_reset_strategy": "no_reset",
                    "expire_strategy": "fixed_date",
                    "expire_date": 50,
                    "usage_duration": 30,
                    "activation_deadline": 80,
                    "reset_data_usage": True
                }
            ]
        }


class TemplateResponse(Template):
    id: int
    created_at: datetime


class TemplateCreate(Template):
    username: str
    name: str
    data_limit: int
    data_limit_reset_strategy: UserDataUsageResetStrategy
    expire_strategy: UserExpireStrategy
    reset_data_usage: bool


class TemplateModify(Template):
    name: Optional[str] = None
    prefix: Optional[str] = None
    suffix: Optional[str] = None
    data_limit: Optional[int] = None
    data_limit_reset_strategy: Optional[UserDataUsageResetStrategy] = None
    expire_strategy: Optional[UserExpireStrategy] = None
    expire_date: Optional[datetime] = None
    usage_duration: Optional[int] = None
    activation_deadline: Optional[datetime] = None
    reset_data_usage: Optional[bool] = None

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "name": "Updated Template",
                    "prefix": "user_",
                    "suffix": "_02",
                    "data_limit": 10000,
                    "expire_strategy": "start_on_first_use",
                    "reset_data_usage": False
                }
            ]
        }
