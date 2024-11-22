from flask import Blueprint, jsonify, request

from src.utils.levenshtein_distance import find_nearest
from src.utils.text_to_speech import text_to_base64_speech

events = Blueprint('events', __name__)

@events.route('/events/<period>', methods=['GET'])
def get_events(period: str):
    available_periods = ['today', 'this_week', 'next_week']
    if period not in available_periods:
        return 'Bad period', 400

    # call google calendar api
    # get events for period

    events_from_calendar = ['event 1', 'event 2', 'event 3']

    return jsonify(events_from_calendar)


@events.route('/events', methods=['POST'])
def create_event():
    name = request.json['name']
    start = request.json['start']
    end = request.json['end']

    # create a new event

    phrase = f"Your event {name} was created."
    return jsonify({
        "b64_phrase": text_to_base64_speech(phrase),
        "phrase": phrase,
        "event": {
            "id": 1,
        }
    }), 201


@events.route('/events', methods=['DELETE'])
def delete_event():
    name = request.json['name']

    # retrieve all event names
    all_events = []
    nearest_event, distance = find_nearest(name, all_events)

    if distance > 5:
        phrase = "I can't find specified event, please try again"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 404

    phrase = f"Event {name} was deleted."
    return jsonify({
        "b64_phrase": text_to_base64_speech(phrase),
        "phrase": phrase
    })