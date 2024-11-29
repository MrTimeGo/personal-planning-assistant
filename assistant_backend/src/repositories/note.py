from src.db.db import db
from src.models.note import Note


def get_user_notes(user_id):
    # Query to retrieve all notes for the user
    notes_query = Note.query.filter_by(user_id=user_id) \
        .order_by(Note.created_at.desc())

    # Execute the query and get the results
    notes = notes_query.all()

    return notes


def get_notes_page(user_id, page, limit):
    # Ensure the page number is at least 1
    if page < 1:
        page = 1

    # Calculate the offset based on the page number
    offset = (page - 1) * limit

    # Query to retrieve notes for the user with pagination
    notes_query = Note.query.filter_by(user_id=user_id) \
        .order_by(Note.created_at.desc()) \
        .limit(limit) \
        .offset(offset)

    # Execute the query and get the results
    notes = notes_query.all()

    return notes


def insert_note(user_id, name, content):
    new_note = Note(user_id=user_id, name=name, content=content)

    # Add the new note to the database session
    db.session.add(new_note)

    # Commit the session to save the note to the database
    db.session.commit()
