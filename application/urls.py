"""
urls.py

URL dispatch route mappings and error handlers

"""

from flask import render_template

from application import app
'''
Read the urls from the following files
'''
from controllers import category, content, media, bookable, booking, user

## Error handlers
# Handle 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Handle 500 errors
@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

