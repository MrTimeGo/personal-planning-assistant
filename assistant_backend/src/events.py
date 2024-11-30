from flask import Blueprint, jsonify, request

from src.utils.levenshtein_distance import find_nearest
from src.utils.text_to_speech import text_to_base64_speech
from flask_login import current_user
from functools import wraps

from datetime import datetime, timedelta

from src.google_calendar.impl import *
from src.google_calendar.impl import create_event as create_event_calendar, delete_event as delete_event_calendar
from src.repositories.user import *
from src.auth import login_verify_required
import pytz

events = Blueprint('events', __name__)
kyiv_tz = pytz.timezone('Europe/Kyiv')


def calendar_track_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            if not current_user.calendar_id:
                return 'Calendar is not being tracked', 400
        except AttributeError:
            return 'Unauthorized', 401

        return f(*args, **kwargs)

    return decorated_function


@events.route('/events/track', methods=['GET'])
@calendar_track_required
@login_verify_required
def get_tracked_calendar():
    return jsonify({"calendar_id": current_user.calendar_id})


@events.route('/events/track/<calendar_id>', methods=['POST'])
@login_verify_required
def track_calendar(calendar_id: str):
    try:
        add_shared_calendar(calendar_id)
        update_user_calendar(current_user.id, calendar_id)

        return 'Calendar tracked', 201
    except Exception as e:
        if str(e) == "Calendar not found":
            return 'Calendar not found', 404
        if str(e) == "Insufficient permissions":
            return 'Insufficient permissions', 403
        print(e)
        return 'Failed to track calendar', 500


@events.route('/events/<period>', methods=['GET'])
@calendar_track_required
@login_verify_required
def get_events(period: str):
    available_periods = ['today', 'this_week', 'next_week']

    if period not in available_periods:
        return 'Bad period', 400

    events_calendar = list_events_period(current_user.calendar_id, period)
    if len(events_calendar) == 0:
        phrase = f"There are no events for {" ".join(period.split('_'))}"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase,
            "body": []
        }), 200

    phrase = f"Here are your events for {" ".join(period.split('_'))}: {", ".join([event.name for event in events_calendar])}."

    return jsonify({
        "b64_phrase": text_to_base64_speech(phrase),
        "phrase": phrase,
        "body": [event.to_dict() for event in events_calendar]
    }), 200


@events.route('/events', methods=['POST'])
@calendar_track_required
@login_verify_required
def create_event():
    name = request.json['name']
    start = request.json['start']
    end = request.json['end']

    try:
        start_time = datetime.fromisoformat(start)
        end_time = datetime.fromisoformat(end)

        if start_time < datetime.now(kyiv_tz) - timedelta(days=7):
            raise ValueError("Start time is too old")

        if start_time > end_time:
            raise ValueError("Start time is after end time")

        event = Event(name=name, start_time=start_time, end_time=end_time)
        create_event_calendar(current_user.calendar_id, event)

        phrase = f"Your event {name} was created."
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase,
            "body": event.to_dict()
        }), 201

    except ValueError:
        return 'Invalid time format', 400
    except Exception as e:
        if str(e) == "Calendar not found":
            return 'Calendar not found', 404
        if str(e) == "Insufficient permissions":
            return 'Insufficient permissions', 403
        if str(e) == "can't compare offset-naive and offset-aware datetimes":
            return 'Invalid time format', 400
        print(e)
        return 'Failed to create event', 500


@events.route('/events/<name>', methods=['DELETE'])
@calendar_track_required
@login_verify_required
def delete_event(name: str):
    events_calendar = list_events(current_user.calendar_id)
    event_names = [event.name for event in events_calendar]
    nearest_event, distance = find_nearest(name, event_names)

    if distance > 5:
        phrase = "I can't find specified event, please try again"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 404

    event = next(event for event in events_calendar if event.name == nearest_event)
    delete_event_calendar(current_user.calendar_id, event.id)

    phrase = f"Event {name} was deleted."
    return jsonify({
        "b64_phrase": text_to_base64_speech(phrase),
        "phrase": phrase,
    }), 200