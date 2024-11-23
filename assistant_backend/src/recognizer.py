import os
from uuid import uuid4

import dateparser
from flask import Blueprint, request, jsonify
from werkzeug.datastructures import FileStorage

import src.commands as cmds
from src.utils.levenshtein_distance import find_nearest
from src.utils.speech_to_text import recognize_speech
from src.utils.text_to_speech import text_to_base64_speech

recognizer = Blueprint('recognizer', __name__)

@recognizer.route('/recognize_command', methods=['POST'])
def recognize_command():
    file = request.files.getlist('audio')
    temp_file_path = f"./file_data/{uuid4()}"
    save_file(file[0], temp_file_path)
    recognized_speech = recognize_speech(temp_file_path)
    os.remove(temp_file_path)
    try:
        result = define_nearest_command(recognized_speech)
        if result:
            return jsonify({
                "command": result[0].value,
                "scenario": result[1].serialize()
            })
        else:
            return jsonify('Not found'), 400
    except Exception as e:
        print(e)
        phrase = "I can't recognize command, please try again"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 400


def save_file(file: FileStorage, path: str):
    with open(path, 'xb') as f:
        file.save(f)


def define_nearest_command(input_command: str) -> (cmds.Command, cmds.Scenario):
    commands = list(map(lambda x: x.trigger.lower(), cmds.scenarios.values()))
    input_command = input_command.lower().strip()
    nearest_trigger, distance = find_nearest(input_command, commands)
    print(f"Recognized input: {input_command}\n",
          f"Nearest command: {nearest_trigger}\n",
          f"Distance: {distance}")
    if distance > 5:
        raise Exception("Could not recognize command")

    for command, scenario in cmds.scenarios.items():
        if scenario.trigger.lower() == nearest_trigger.lower():
            return command, scenario

    raise Exception("Could not recognize command")


@recognizer.route('/recognize_text', methods=['POST'])
def recognize_text():
    file = request.files.getlist('audio')
    temp_file_path = f"./file_data/{uuid4()}"
    save_file(file[0], temp_file_path)
    recognized_speech = recognize_speech(temp_file_path)
    os.remove(temp_file_path)
    return jsonify({ "result": recognized_speech })


@recognizer.route('/recognize_boolean', methods=['POST'])
def recognize_boolean():
    file = request.files.getlist('audio')
    temp_file_path = f"./file_data/{uuid4()}"
    save_file(file[0], temp_file_path)
    recognized_speech = recognize_speech(temp_file_path)
    os.remove(temp_file_path)

    options = ['yes', 'no']
    nearest_option, distance = find_nearest(recognized_speech.strip().lower(), options)

    if distance > 2:
        phrase = "I can't understand what you said, please repeat"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 400

    if nearest_option == 'yes':
        return jsonify({"result": True})
    else:
        return jsonify({"result": False})


@recognizer.route('/recognize_date', methods=['POST'])
def recognize_date():
    file = request.files.getlist('audio')
    temp_file_path = f"./file_data/{uuid4()}"
    save_file(file[0], temp_file_path)
    recognized_speech = recognize_speech(temp_file_path)
    os.remove(temp_file_path)

    date = dateparser.parse(recognized_speech, settings={'TIMEZONE': 'Europe/Kyiv'})
    print(f"Recognized speech: {recognized_speech}\nParsed date: {date}")
    if date is None:
        phrase = "I can't understand what you said, please repeat"
        return jsonify({
            "b64_phrase": text_to_base64_speech(phrase),
            "phrase": phrase
        }), 400
    return jsonify({"result": date.isoformat()})