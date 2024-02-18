from app import marznode
from app.db import GetDB, crud, get_tls_certificate


async def nodes_startup():
    with GetDB() as db:
        certificate = get_tls_certificate(db)
        db_nodes = crud.get_nodes(db=db, enabled=True)
        for db_node in db_nodes:
            await marznode.operations.add_node(db_node, certificate)
