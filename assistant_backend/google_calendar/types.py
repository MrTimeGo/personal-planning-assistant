from datetime import datetime


def event_from_calendar_body(body):
    return Event(
        name=body['summary'],
        start_time=datetime.fromisoformat(body['start']['dateTime']),
        end_time=datetime.fromisoformat(body['end']['dateTime'])
    )


class Event:
    def __init__(self, name: str, start_time: datetime, end_time: datetime):
        self.name = name
        self.start_time = start_time
        self.end_time = end_time

    def __str__(self):
        return f"Event: {self.name} from {self.start_time} to {self.end_time}"

    def __repr__(self):
        return f"Event: {self.name} from {self.start_time} to {self.end_time}"

    def to_calendar_body(self):
        return {
            'summary': self.name,
            'start': {
                'dateTime': self.start_time.isoformat(),
                'timeZone': 'Europe/Kyiv',
            },
            'end': {
                'dateTime': self.end_time.isoformat(),
                'timeZone': 'Europe/Kyiv',
            },
        }

