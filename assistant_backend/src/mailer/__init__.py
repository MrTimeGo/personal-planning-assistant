from mailjet_rest import Client
from decouple import config

api_key = config("EMAIL_USER")
api_secret = config("EMAIL_PASSWORD")
mailjet = Client(auth=(api_key, api_secret), version='v3.1')
