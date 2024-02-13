from typing import List, Optional

from pydantic import ConfigDict, BaseModel, Field, computed_field


class ServiceBase(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = Field(None)
    model_config = ConfigDict(from_attributes=True)


from app.models.proxy import InboundBase
from app.models.user import UserBase


class Service(ServiceBase):
    users: List[UserBase] = Field([])
    inbounds: List[InboundBase] = Field([])


class ServiceCreate(ServiceBase):
    users: List[int] = Field([])
    inbounds: List[int] = Field([])
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "name": "my service 1",
            "inbounds": [1, 5, 9],
            "users": [1, 2, 3]
        }
    })


class ServiceModify(ServiceBase):
    inbounds: Optional[List[int]] = Field(None)
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "id": 2,
            "name": "my service 2",
            "inbounds": [1, 2, 3]
        }
    })


class ServiceResponse(Service):
    id: int

    @computed_field
    @property
    def user_ids(self) -> List[int]:
        return [u.id for u in self.users]

    @computed_field
    @property
    def inbound_ids(self) -> List[int]:
        return [i.id for i in self.inbounds]

    model_config = ConfigDict(from_attributes=True)
