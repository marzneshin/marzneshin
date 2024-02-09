from abc import ABC


class MarzNodeBase(ABC):

    async def fetch_inbounds(self):
        """returns a list of inbounds on the node"""

    async def add_user(self, user, inbounds: list[str] | None = None) -> None:
        """adds a user to the node with inbounds specified"""

    async def remove_user(self, user, inbounds: list[str] | None = None) -> None:
        """removes a user or some inbounds from a user on the node"""

    async def update_user_inbounds(self, user,
                                   inbound_additions: list[str] | None = None,
                                   inbound_reductions: list[str] | None = None) -> None:
        """adds some inbounds and removes some inbounds for a user on the node"""

    async def repopulate_users(self, users) -> None:
        """syncs users with the node"""

    async def fetch_users_stats(self):
        """get user stats from the node"""

    async def is_alive(self) -> bool:
        """
        checks if node is up and running and connected
        :return: True if the node is responsive, otherwise False
        """
