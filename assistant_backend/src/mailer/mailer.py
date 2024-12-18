from decouple import config
from . import mailjet

def send_verification_code(to, code):
    template_path = "./src/templates/verification.html"

    # Read the template from the specified file path
    try:
        with open(template_path, 'r') as template_file:
            template = template_file.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Template file not found at {template_path}")

    # Replace placeholders in the template dynamically
    template = template.format(code=code)
    subject = "Your Verification Code"

    data = {
        'Messages': [
            {
                "From": {
                    "Email": config("MAIL_DEFAULT_SENDER"),
                    "Name": "Flasker Maxymo"
                },
                "To": [
                    {
                        "Email": to
                    }
                ],
                "Subject": subject,
                "HTMLPart": template
            }
        ]
    }

    result = mailjet.send.create(data=data)
    if result.status_code != 200:
        raise Exception(f"Failed to send verification code to {to}")
