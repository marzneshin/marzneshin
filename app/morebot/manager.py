import requests
import logging
from typing import Optional, Dict, List, Any
from collections import defaultdict
from sqlalchemy.orm import Session
from app.db.models import Admin, User
from app.config import MOREBOT_LICENSE, MOREBOT_SECRET

logger = logging.getLogger("uvicorn.error")


class Morebot:
    _base_url = f"https://{MOREBOT_LICENSE}.morebot.top/api/subscriptions/{MOREBOT_SECRET}"
    _timeout = 3
    _failed_reports = defaultdict(int)

    @classmethod
    def report_admin_usage(
        cls, db: Session, users_usage: List[Dict[str, Any]]
    ) -> bool:
        if not users_usage:
            return True
        admin_usage = defaultdict(int)
        user_admin_map = dict(db.query(User.id, User.admin_id).all())
        for user_usage in users_usage:
            user_id = int(user_usage["uid"])
            admin_id = user_admin_map.get(user_id)
            if admin_id:
                admin_usage[admin_id] += user_usage["value"]

        admins = dict(db.query(Admin.id, Admin.username).all())
        report_data = {
            admins.get(admin_id, "Unknown"): int(value)
            for admin_id, value in admin_usage.items()
        }

        merged_data = report_data.copy()
        if cls._failed_reports:
            for admin, value in cls._failed_reports.items():
                merged_data[admin] = merged_data.get(admin, 0) + value

        try:
            response = requests.post(
                f"{cls._base_url}/usages",
                json=merged_data,
                timeout=cls._timeout,
            )
            response.raise_for_status()
            logger.info("Admin usage report successfully.")
            cls._failed_reports.clear()
        except requests.RequestException:
            cls._save_failed_report(report_data)
            return False

    @classmethod
    def _save_failed_report(cls, data: Dict[str, int]):
        for admin, value in data.items():
            cls._failed_reports[admin] += value
