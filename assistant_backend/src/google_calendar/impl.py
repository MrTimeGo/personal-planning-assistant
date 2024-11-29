from . import service
from .utils import get_today_range, get_week_range, get_next_week_range
from .types import Event, event_from_calendar_body
from googleapiclient.errors import HttpError

def list_available_calendars():
    calendar_list = service.calendarList().list().execute()
    calendars = calendar_list.get('items', [])
    return [calendar['summary'] for calendar in calendars]

def add_shared_calendar(calendar_id):
    calendar_entry = {
        'id': calendar_id
    }

    try:
        service.calendarList().insert(body=calendar_entry).execute()
    except HttpError as e:
        if e.resp.status == 404:
            raise Exception(f"Calendar not found")
        if e.resp.status == 403:
            raise Exception(f"Insufficient permissions")
        if e.resp.status == 409:
            return
        raise Exception(f"Failed to add calendar")
    except:
        raise Exception(f"Failed to add calendar")

    if not valid_calendar_access(calendar_id):
        raise Exception(f"Insufficient permissions")


def valid_calendar_access(calendar_id):
    try:
        calendar = service.calendarList().get(calendarId=calendar_id).execute()

        # Extract the access role
        access_role = calendar.get('accessRole', 'unknown')

        # Determine if the access role allows modification
        if access_role not in ['owner', 'writer']:
            return False

        return True
    except HttpError as e:
        if e.resp.status == 404:
            raise Exception(f"Calendar not found")
        raise Exception(f"Failed to validate calendar access")
    except:
        raise Exception(f"Failed to validate calendar access")


def create_event(calendar_id, event: Event):
    try:
        service.events().insert(calendarId=calendar_id, body=event.to_calendar_body()).execute()
    except HttpError as e:
        if e.resp.status == 404:
            raise Exception(f"Calendar not found")
        if e.resp.status == 403:
            raise Exception(f"Insufficient permissions")
        if e.resp.status == 409:
            return
        raise Exception(f"Failed to create event")
    except:
        raise Exception(f"Failed to create event")


def list_events(calendar_id):
    try:
        events_result = service.events().list(calendarId=calendar_id).execute()
        if not events_result:
            return []

        events = []
        for event in events_result['items']:
            events.append(event_from_calendar_body(event))

        return events
    except HttpError as e:
        if e.resp.status == 404:
            raise Exception(f"Calendar not found")
        if e.resp.status == 403:
            raise Exception(f"Insufficient permissions")
        if e.resp.status == 409:
            return
        raise Exception(f"Failed to list events")
    except:
        raise Exception(f"Failed to list events")

    return events

def list_events_period(calendar_id, period):
    if period == 'today':
        return list_events_today(calendar_id)
    if period == 'this_week':
        return list_events_this_week(calendar_id)
    if period == 'next_week':
        return list_events_next_week(calendar_id)
    return []

def list_events_today(calendar_id):
    start_time, end_time = get_today_range()
    return list_events_in_time_range(calendar_id, start_time, end_time)

def list_events_this_week(calendar_id):
    start_time, end_time = get_week_range()
    return list_events_in_time_range(calendar_id, start_time, end_time)

def list_events_next_week(calendar_id):
    start_time, end_time = get_next_week_range()
    return list_events_in_time_range(calendar_id, start_time, end_time)

def list_events_in_time_range(calendar_id, start_time, end_time):
    try:
        events_result = service.events().list(
            calendarId=calendar_id,
            timeMin=start_time,
            timeMax=end_time,
            singleEvents=True,
            orderBy='startTime'
        ).execute()

        if not events_result:
            return []

        events = []
        for event in events_result['items']:
            events.append(event_from_calendar_body(event))

        return events
    except HttpError as e:
        if e.resp.status == 404:
            raise Exception(f"Calendar not found")
        if e.resp.status == 403:
            raise Exception(f"Insufficient permissions")
        if e.resp.status == 409:
            return
        raise Exception(f"Failed to list events")
    except:
        raise Exception(f"Failed to list events")


def delete_event(calendar_id, event_id):
    try:
        service.events().delete(calendarId=calendar_id, eventId=event_id).execute()
    except HttpError as e:
        if e.resp.status == 404:
            raise Exception(f"Calendar or event not found")
        if e.resp.status == 403:
            raise Exception(f"Insufficient permissions")
        raise Exception(f"Failed to delete event")
    except:
        raise Exception(f"Failed to delete event")


def delete_events_by_name(calendar_id, event_name: str):
    deleted_count = 0
    for event in list_events(calendar_id):
        if event['summary'] == event_name:
            try:
                service.events().delete(calendarId=calendar_id, eventId=event['id']).execute()
            except HttpError as e:
                if e.resp.status == 404:
                    raise Exception(f"Calendar not found")
                if e.resp.status == 403:
                    raise Exception(f"Insufficient permissions")
                if e.resp.status == 409:
                    return
                raise Exception(f"Failed to delete event")
            except:
                raise Exception(f"Failed to delete event")
            deleted_count += 1

    return deleted_count

