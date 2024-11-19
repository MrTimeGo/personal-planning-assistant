run:
	FLASK_APP=src python3 manage.py run

migrate-up:
	FLASK_APP=src flask db upgrade

migrate-down:
	FLASK_APP=src flask db downgrade

clear-migrations:
	rm -rf migrations/versions/*

migration:
	FLASK_APP=src flask db migrate -m "initial migration"

r:
	python3 -m pip install -r requirements.txt


downup:
	make migrate-down
	make migrate-up