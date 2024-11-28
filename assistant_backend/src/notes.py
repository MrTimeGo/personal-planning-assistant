from flask import Blueprint, request, jsonify

from src.utils.levenshtein_distance import find_nearest
from src.utils.text_to_speech import text_to_base64_speech

notes = Blueprint('notes', __name__)

@notes.route('/notes', methods=['GET'])
def get_notes():
    page = request.args.get('page', 1, type=int)

    # get first 5 notes
    # add notes created date!!!
    notes_page = ['note1', 'note2', 'note3', 'note4', 'note5']

    phrase = "Here are some notes that I found"
    return jsonify({
        "phrase": phrase,
        "b64_phrase": text_to_base64_speech(phrase),
        "body": notes_page
    })


@notes.route('/notes', methods=['POST'])
def create_note():
    name = request.json['name']
    content = request.json['content']

    #create note

    phrase = f"Note {name} was created"
    return jsonify({
        "phrase": phrase,
        "b64_phrase": text_to_base64_speech(phrase),
    })


@notes.route('/notes/<name>', methods=['get'])
def get_note(name):
    all_notes = []
    nearest_note, distance = find_nearest(name, all_notes)

    # get note content
    content = ''

    if distance > 5:
        phrase = "I can't find specified note, please try again"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 404

    phrase = f"Here is your note... {content}"
    return jsonify({
        "b64_phrase": text_to_base64_speech(phrase),
        "phrase": phrase
    })