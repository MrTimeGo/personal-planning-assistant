import os
from decouple import config

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request


CREDENTIALS_FILE = config("GOOGLE_CREDENTIALS_FILE")
TOKEN_FILE = config("GOOGLE_TOKEN_FILE")
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_credentials():
    creds = None

    # Check if token.json exists for saved credentials
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # If no valid credentials, initiate the OAuth 2.0 flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for future use
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    return creds

# Authenticate and build the service
credentials = get_credentials()
service = build('calendar', 'v3', credentials=credentials)
