from datetime import datetime


def calculate_usage_percent(used_traffic: int, data_limit: int) -> float:
    return (used_traffic * 100) / data_limit


def calculate_expiration_days(expire: datetime) -> int:
    return (expire - datetime.utcnow()).days
