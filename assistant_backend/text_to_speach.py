import base64
from typing import Generator

from gtts import gTTS


def text_to_speech(text: str) -> Generator[bytes, any, any]:
    return gTTS(text=text, lang='en', slow=True).stream()

def text_to_base64_speech(text: str) -> str:
    combined_bytes = b''.join(text_to_speech(text))
    return base64.b64encode(combined_bytes).decode()