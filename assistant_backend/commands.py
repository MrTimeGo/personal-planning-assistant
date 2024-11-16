from enum import Enum
from typing import List


class Command(Enum):
    CREATE_NOTE = 'create_note'
    LIST_NOTES = 'list_notes'
    GET_NOTE = 'get_note'

    CREATE_EVENT = 'create_event'
    LIST_EVENTS_TODAY = 'list_events_today'
    LIST_EVENTS_THIS_WEEK = 'list_events_this_week'
    LIST_EVENTS_NEXT_WEEK = 'list_events_next_week'
    REMOVE_EVENT = 'remove_event'


class ExpectedInputType(Enum):
    TEXT = 'text'
    DATE = 'date'
    BOOLEAN = 'boolean'


class Question:
    def __init__(
            self,
            phrase: str,
            expected_input_field: str,
            expected_input_type: ExpectedInputType
    ):
        self.phrase = phrase
        self.expected_input_field = expected_input_field
        self.expected_input_type = expected_input_type


class Scenario:
    def __init__(
            self,
            trigger: str,
            questions: List[Question],
    ):
        self.trigger = trigger
        self.questions = questions


scenarios = {
    Command.CREATE_NOTE: Scenario(
        trigger='Make a note',
        questions=[
            Question(phrase='How note should be named?', expected_input_field='name',
                     expected_input_type=ExpectedInputType.TEXT),
            Question(phrase='Please dictate the note', expected_input_field='content',
                     expected_input_type=ExpectedInputType.TEXT),
        ]
    ),
    Command.LIST_NOTES: Scenario(
        trigger='What notes do I have?',
        questions=[
            Question(phrase='Do you want to hear more?', expected_input_field='more',
                     expected_input_type=ExpectedInputType.BOOLEAN),
        ]
    ),
    Command.GET_NOTE: Scenario(
        trigger='Read the note',
        questions=[
            Question(phrase="What's the name of the note you'd like to hear", expected_input_field='name',
                     expected_input_type=ExpectedInputType.TEXT),
        ]
    ),
    Command.CREATE_EVENT: Scenario(
        trigger='Create an event',
        questions=[
            Question(phrase='What is the name of the event?', expected_input_field='name',
                     expected_input_type=ExpectedInputType.TEXT),
            Question(phrase='When does it start?', expected_input_field='start',
                     expected_input_type=ExpectedInputType.DATE),
            Question(phrase='When does it end?', expected_input_field='end',
                     expected_input_type=ExpectedInputType.DATE),
        ]
    ),
    Command.LIST_EVENTS_TODAY: Scenario(
        trigger='What is planned for today?',
        questions=[]
    ),
    Command.LIST_EVENTS_THIS_WEEK: Scenario(
        trigger='What is planned for this week?',
        questions=[]
    ),
    Command.LIST_EVENTS_NEXT_WEEK: Scenario(
        trigger='What is planned for the next week?',
        questions=[]
    ),
    Command.REMOVE_EVENT: Scenario(
        trigger='Remove the event',
        questions=[
            Question(phrase='What is the event name to remove?', expected_input_field='name',
                     expected_input_type=ExpectedInputType.TEXT),
        ]
    )
}
