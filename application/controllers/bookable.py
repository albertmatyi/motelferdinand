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
from flask.globals import request

@app.route("/admin/bookables/", methods=["POST"])
def admin_bookables():
    return str(helpers.save_obj_from_req(BookableModel).key().id());
    pass

@app.route('/admin/bookables/<int:entityId>', methods=['POST', 'DELETE'])
def admin_delete_bookable(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookableModel.get_by_id(entityId).delete()
        return "{ 'value' : 'OK' }"
    pass