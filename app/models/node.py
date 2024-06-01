from enum import Enum
from typing import List, Optional

from pydantic import ConfigDict, BaseModel, Field


class NodeStatus(str, Enum):
    healthy = "healthy"
    unhealthy = "unhealthy"
    disabled = "disabled"


class NodeConnectionBackend(str, Enum):
    grpcio = "grpcio"
    grpclib = "grpclib"


class NodeSettings(BaseModel):
    min_node_version: str = "v0.2.0"
    certificate: str


class NodeBase(BaseModel):
    id: Optional[int] = Field(None)
    name: str
    address: str
    port: int = 62050
    connection_backend: NodeConnectionBackend = Field(
        default=NodeConnectionBackend.grpclib
    )
    usage_coefficient: float = Field(ge=0, default=1.0)
    model_config = ConfigDict(from_attributes=True)


from app.models.proxy import InboundBase


class Node(NodeBase):
    inbounds: Optional[List[InboundBase]] = None


class NodeCreate(Node):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "DE node",
                "address": "192.168.1.1",
                "port": 62050,
                "usage_coefficient": 1,
            }
        }
    )


class NodeModify(Node):
    name: Optional[str] = Field(None)
    address: Optional[str] = Field(None)
    port: Optional[int] = Field(None)
    connection_backend: Optional[NodeConnectionBackend] = Field(None)
    status: Optional[NodeStatus] = Field(None)
    usage_coefficient: Optional[float] = Field(None, ge=0)
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "DE node",
                "address": "192.168.1.1",
                "port": 62050,
                "api_port": 62051,
                "status": "disabled",
                "usage_coefficient": 1.0,
            }
        }
    )


class NodeResponse(Node):
    xray_version: Optional[str] = None
    status: NodeStatus
    message: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class NodeUsageResponse(BaseModel):
    node_id: Optional[int] = None
    node_name: str
    uplink: int
    downlink: int


class NodesUsageResponse(BaseModel):
    usages: List[NodeUsageResponse]
