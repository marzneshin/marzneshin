"""app.marznode stores nodes and provides entities to communicate with the nodes"""
from typing import Dict

import app.marznode.operations as operations
from app.marznode.base import MarzNodeBase
from app.marznode.grpc import MarzNodeGRPC

nodes: Dict[int, MarzNodeBase] = {}


__all__ = [
    "nodes",
    "operations",
    "MarzNodeGRPC",
    "MarzNodeBase"
]
