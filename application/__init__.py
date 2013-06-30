"""
Initialize Flask app

"""

from flask import Flask
from helpers import si18n

app = Flask('application')

import urls

app.jinja_env.globals.update(__=si18n.translate)
