import os
import sqlalchemy
from yaml import load, Loader
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

if os.environ.get('GAE_ENV') != 'standard':
    variables = load(open("app.yaml"), Loader=Loader)
    env_variables = variables['env_variables']
    for var in env_variables:
        os.environ[var] = env_variables[var]

db = sqlalchemy.create_engine(
    sqlalchemy.engine.url.URL(
        drivername="mysql+pymysql",
        username=os.environ.get("MYSQL_USER"),
        password=os.environ.get("MYSQL_PASSWORD"),
        database=os.environ.get("MYSQL_DB"),
        host=os.environ.get("MYSQL_HOST")
    )
)

# TODO edit CORS whitelist in yaml when uploading to gcp
CORS(app, origins=os.environ.get("FRONTEND"))

from app import routes