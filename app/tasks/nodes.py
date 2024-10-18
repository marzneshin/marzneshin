from app import marznode
from app.db import get_db_session, crud, get_tls_certificate


async def nodes_startup():
    async for db in get_db_session():
        certificate = await get_tls_certificate(db)
        db_nodes = await crud.get_nodes(db=db, enabled=True)
        for db_node in db_nodes:
            await marznode.operations.add_node(db_node, certificate)
