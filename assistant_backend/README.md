# assistant_backend

## Spin up the server
1. Install the required packages by running `pip install -r requirements.txt`
2. Set up the environment variables by creating a `.env` file (see `.env.example` for an example)
3. Migrate the database by running `FLASK_APP=src flask db upgrade`
4. Run the server by running `FLASK_APP=src python3 manage.py`

## Crutches (костилі)
- `src/db/db.py` - contains one variable `db` which is the database connection.
It is here because of circular imports. Refactor it if you can.
- 
    ``` ```
  
## Known issues
- Problem: `Error: pg_config executable not found.`. Fix: `sudo apt-get install libpq-dev`.