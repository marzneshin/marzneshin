import requests
import logging
from typing import Dict, List, Any
from collections import defaultdict
from sqlalchemy.orm import Session
from app.db.models import Admin, User
from app.config import MOREBOT_LICENSE, MOREBOT_SECRET

logger = logging.getLogger("uvicorn.error")


class Morebot:
    _base_url = f"https://{MOREBOT_LICENSE}.morebot.top/api/subscriptions/{MOREBOT_SECRET}"
    _timeout = 3
    _failed_reports = []

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
        report_data = [
            {"username": admins.get(admin_id, "Unknown"), "usage": int(value)}
            for admin_id, value in admin_usage.items()
        ]

        merged_data = report_data.copy()
        if cls._failed_reports:
            for failed_report in cls._failed_reports:
                found = False
                for report in merged_data:
                    if report["username"] == failed_report["username"]:
                        report["usage"] += failed_report["usage"]
                        found = True
                        break
                if not found:
                    merged_data.append(failed_report)

        try:
            response = requests.post(
                f"{cls._base_url}/usages",
                json=merged_data,
                timeout=cls._timeout,
            )
            response.raise_for_status()
            logger.info("Admin usage report successfully.")
            cls._failed_reports.clear()
            return True
        except requests.RequestException as e:
            logger.error(f"Failed to upsert admin usage report: {str(e)}")
            cls._save_failed_report(report_data)
            return False

    @classmethod
    def _save_failed_report(cls, data: List[Dict[str, Any]]):
        cls._failed_reports.extend(data)
