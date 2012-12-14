'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers
from flask.templating import render_template

@app.route("/admin/bookables/", methods=["POST"])
def admin_contents():
    return str(helpers.save_obj_from_req(BookableModel).key().id());
    pass
