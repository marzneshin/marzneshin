from abc import ABC


class MarzNodeBase(ABC):

    async def fetch_inbounds(self):
        """returns a list of inbounds on the node"""

    async def update_user(self, user,
                          inbounds: list[str] | None = None) -> None:
        """updates a user on the node"""

    async def repopulate_users(self, users) -> None:
        """syncs users with the node"""

    async def fetch_users_stats(self):
        """get user stats from the node"""

    async def is_alive(self) -> bool:
        """
        checks if node is up and running and connected
        :return: True if the node is responsive, otherwise False
        """
