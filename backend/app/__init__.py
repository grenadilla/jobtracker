import os
import sqlalchemy
from yaml import load, Loader
from flask import Flask, request, render_template

def init_connect_engine():
    if os.environ.get('GAE_ENV') != 'standard':
        variables = load(open("app.yaml"), Loader = Loader)
        env_variables = variables['env_variables']
        for var in env_variables:
            os.environ[var] = env_variables[var]

    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL(
            drivername="mysql+pymysql",
            username=os.environ.get('MYSQL_USER'),
            password=os.environ.get('MYSQL_PASSWORD'),
            database=os.environ.get('jobtracker'), #db name
            host=os.environ.get('MYSQL_HOST') # ip
        )
    )
    return pool

app = Flask(__name__)

db = init_connect_engine()
conn = db.connect()
results = conn.execute("Select * from jobtracker.User")

print([x for x in results])
conn.close()

#@app.route("/")
#def homepage():
    #return "Hello World!
