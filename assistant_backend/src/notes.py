from flask import Blueprint, request, jsonify
from flask_login import current_user

from src.utils.levenshtein_distance import find_nearest
from src.utils.text_to_speech import text_to_base64_speech
from src.auth import login_verify_required

from src.repositories.note import *


notes = Blueprint('notes', __name__)


@notes.route('/notes', methods=['GET'])
@login_verify_required
def get_notes():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 5, type=int)

    notes_page = get_notes_page(current_user.id, page, limit)

    if len(notes_page) == 0:
        phrase = "No notes found"
        return jsonify({
            "phrase": phrase,
            "b64_phrase": text_to_base64_speech(phrase),
            "body": []
        })

    phrase = "Here are some notes that I found"
    return jsonify({
        "phrase": phrase,
        "b64_phrase": text_to_base64_speech(phrase),
        "body": [note.to_dict() for note in notes_page]
    })


@notes.route('/notes', methods=['POST'])
@login_verify_required
def create_note():
    name = request.json['name']
    content = request.json['content']

    insert_note(current_user.id, name, content)

    phrase = f"Note {name} was created"

    return jsonify({
        "phrase": phrase,
        "b64_phrase": text_to_base64_speech(phrase),
    }), 201


@notes.route('/notes/<name>', methods=['GET'])
@login_verify_required
def get_note(name):
    all_notes = get_user_notes(current_user.id)

    nearest_note_name, distance = find_nearest(name, [note.name for note in all_notes])

    if distance > 5:
        phrase = "I can't find specified note, please try again"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 404

    nearest_note = next(note for note in all_notes if note.name == nearest_note_name)
    phrase = f"Here is your note... {nearest_note.content}"
    return jsonify({
        "b64_phrase": text_to_base64_speech(phrase),
        "phrase": phrase,
        "body": {
            "name": nearest_note_name,
            "content": nearest_note.content
        },
    })
