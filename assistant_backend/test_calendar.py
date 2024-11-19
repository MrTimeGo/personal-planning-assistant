from google_calendar import impl
from datetime import datetime, timedelta
from google_calendar.types import Event
from google_calendar.utils import get_week_range

if __name__ == "__main__":
    calendar_id = '036ecfe1a25e74938a2224b16a0c224beebcd3b5b8cab3cfba1562ceb6ddbf58@group.calendar.google.com'
    impl.add_shared_calendar(calendar_id)
    print(impl.list_available_calendars())
    print(impl.valid_calendar_access(calendar_id))
    print(impl.list_events(calendar_id))
    print(impl.list_events_today(calendar_id))
    print(impl.list_events_this_week(calendar_id))
    print(impl.list_events_next_week(calendar_id))

    st, end = get_week_range()
    event = Event(name='Test Event 2', start_time=datetime.fromisoformat(st) + timedelta(days=1), end_time=datetime.fromisoformat(end) + timedelta(days=1))

    impl.create_event(calendar_id, event)
    print(impl.list_events(calendar_id))
    print(impl.list_events_today(calendar_id))
    print(impl.list_events_this_week(calendar_id))
    print(impl.list_events_next_week(calendar_id))


