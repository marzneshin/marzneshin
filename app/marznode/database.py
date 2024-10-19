from app.db import crud, get_db_session
from app.models.node import NodeStatus


class MarzNodeDB:
    async def list_users(self):
        async for db in get_db_session():
            relations = await crud.get_node_users(db, self.id)
            users = dict()
            for rel in relations:
                if not users.get(rel[0]):
                    users[rel[0]] = dict(
                        username=rel[1], id=rel[0], key=rel[2], inbounds=[]
                    )
                users[rel[0]]["inbounds"].append(rel[3].tag)
        return list(users.values())

    async def store_backends(self, backends):
        inbounds = [
            inbound for backend in backends for inbound in backend.inbounds
        ]
        async for db in get_db_session():
            await crud.ensure_node_backends(db, backends, self.id)
            await crud.ensure_node_inbounds(db, inbounds, self.id)

    async def set_status(self, status: NodeStatus, message: str | None = None):
        async for db in get_db_session():
            await crud.update_node_status(db, self.id, status, message)
