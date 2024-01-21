from typing import Dict, List, Optional, Union

from pydantic import ConfigDict, BaseModel, Field, validator

# from app import xray


class ServiceBase(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = Field(None, nullable=True)
    model_config = ConfigDict(from_attributes=True)

from app.models.proxy import InboundBase
from app.models.user import UserBase

class Service(ServiceBase):
    users: List[UserBase] = Field([])
    inbounds: List[InboundBase] = Field([])


class ServiceCreate(Service):
    users: List[int] = Field([])
    inbounds: List[int] = Field([])
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "name": "my service 1",
            "inbounds": [1, 5, 9],
            "users": [1, 2, 3]
        }
    })


class ServiceModify(Service):
    id: int
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "id": 2,
            "name": "my service 2",
            "inbounds": [1, 2, 3],
            "users": [1, 2, 3],
        }
    })


class ServiceResponse(Service):
    id: int
    users: List[UserBase] = Field([])
    inbounds: List[InboundBase] = Field([])
    """
    @validator("inbounds", pre=True)
    def validate_inbounds(cls, v):
        final = {}
        inbound_tags = [i.tag for i in v]
        for protocol, inbounds in xray.config.inbounds_by_protocol.items():
            for inbound in inbounds:
                if inbound["tag"] in inbound_tags:
                    if protocol in final:
                        final[protocol].append(inbound["tag"])
                    else:
                        final[protocol] = [inbound["tag"]]
        return final
    """
    model_config = ConfigDict(from_attributes=True)
