FROM python:3.12-slim

WORKDIR /python-docker

RUN apt-get update
RUN apt-get install -y libpq-dev python3-dev

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP=src
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]