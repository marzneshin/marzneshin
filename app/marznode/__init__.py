"""stores nodes and provides entities to communicate with the nodes"""
from typing import Dict

from . import operations
from .base import MarzNodeBase
from .grpcio import MarzNodeGRPCIO

nodes: Dict[int, MarzNodeBase] = {}


__all__ = [
    "nodes",
    "operations",
    "MarzNodeGRPCIO",
    "MarzNodeBase"
]
