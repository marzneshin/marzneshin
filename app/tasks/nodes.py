from app import marznode
from app.db import GetDB, crud, get_tls_certificate
from app.marznode import MarzNodeGRPCIO


async def nodes_startup():
    with GetDB() as db:
        certificate = get_tls_certificate(db)
        db_nodes = crud.get_nodes(db=db, enabled=True)
        for db_node in db_nodes:
            node = MarzNodeGRPCIO(db_node.id, db_node.address, db_node.port)
            await marznode.operations.add_node(db_node.id, node)
            # crud.update_node_status(db, db_node, NodeStatus.connecting)
