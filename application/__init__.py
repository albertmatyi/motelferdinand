"""
Initialize Flask app

"""

from flask import Flask
from helpers import si18n

app = Flask('application')

APP_MAIL_SENDER =\
    'albertmatyi@gmail.com'
APP_ADMIN_MAILS = [
    'Developer <albertmatyi@gmail.com>',
    ', Owner <zozipus@yahoo.com>'
]

import urls

app.jinja_env.globals.update(__=si18n.translate)
