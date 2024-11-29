from datetime import datetime, timedelta
import pytz

kyiv_tz = pytz.timezone('Europe/Kyiv')

def get_today_range():
    """Get the start and end of today in Kyiv timezone (RFC3339 format)."""
    now = datetime.now(kyiv_tz)
    start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_today = start_of_today + timedelta(days=1)
    return start_of_today.isoformat(), end_of_today.isoformat()


def get_week_range():
    """Get the start and end of the current week in Kyiv timezone (RFC3339 format)."""
    now = datetime.now(kyiv_tz)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_week = start_of_week + timedelta(days=7)
    return start_of_week.isoformat(), end_of_week.isoformat()


def get_next_week_range():
    """Get the start and end of the next week in Kyiv timezone (RFC3339 format)."""
    now = datetime.now(kyiv_tz)
    start_of_next_week = (now - timedelta(days=now.weekday())) + timedelta(days=7)
    start_of_next_week = start_of_next_week.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_next_week = start_of_next_week + timedelta(days=7)
    return start_of_next_week.isoformat(), end_of_next_week.isoformat()