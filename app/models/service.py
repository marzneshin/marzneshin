from pydantic import ConfigDict, BaseModel, Field


class Service(BaseModel):
    id: int | None = None
    name: str | None = Field(None)
    model_config = ConfigDict(from_attributes=True)


class ServiceCreate(Service):
    inbound_ids: list[int] = Field([])
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "my service 1",
                "inbound_ids": [1, 5, 9],
            }
        }
    )


class ServiceModify(Service):
    inbound_ids: list[int] | None = Field(None)
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 2,
                "name": "my service 2",
                "inbound_ids": [1, 2, 3],
            }
        }
    )


class ServiceResponse(Service):
    inbound_ids: list[int]
    user_ids: list[int]

    model_config = ConfigDict(from_attributes=True)
