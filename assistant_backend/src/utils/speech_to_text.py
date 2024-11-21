from typing import IO

import pickle
import whisper
from decouple import config

model_size = config("SPEECH_RECOGNITION_MODEL_SIZE")

model = whisper.load_model(f"{model_size}.en")

def recognize_speech(speech_file: str):
    return whisper.transcribe(model, speech_file)["text"]