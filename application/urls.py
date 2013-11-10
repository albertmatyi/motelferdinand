"""
urls.py

URL dispatch route mappings and error handlers

"""
from flask import render_template

from application import app


## Error handlers
# Handle 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


# Handle 500 errors
@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

# from werkzeug.debug import DebuggedApplication
# app = DebuggedApplication(app, evalex=True)

'''
Read the urls from the following files
'''
from controllers import category, content, bookable, bookable_variant, booking, user, prop, db
