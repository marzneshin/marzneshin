from abc import ABC


class MarzNodeBase(ABC):

    async def fetch_inbounds(self):
        """returns a list of inbounds on the node"""

    async def add_user(self, user, inbounds):
        """adds a user to the node with inbounds specified"""

    async def remove_user(self, user, inbounds=None):
        """removes a user or some inbounds from a user on the node"""

    async def update_user_inbounds(self, user, inbound_additions, inbound_reductions):
        """adds some inbounds and removes some inbounds for a user on the node"""

    async def repopulate_users(self, users):
        """syncs users with the node"""

    async def fetch_users_stats(self):
        """get user stats from the node"""
