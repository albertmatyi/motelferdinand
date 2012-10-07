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


BookableForm = model_form(BookableModel, wtf.Form)

@app.route("/admin/bookables/", methods=["GET", "POST"])
def admin_bookables(filtr=lambda qry:qry):
    helpers.admin_handle_post(BookableModel, BookableForm, 'admin_bookables')
    return render_template('bookables/list.html', list=filtr(BookableModel.all()), properties=BookableModel.properties(), categories=CategoryModel.all())  
    pass

@app.route("/admin/bookables/new", methods=["GET"])
def admin_new_bookable():
    return helpers.admin_new(BookableForm, 'admin_bookables')
    pass

@app.route("/admin/bookables/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
def admin_edit_bookable(mdl_id):
    return helpers.admin_edit(mdl_id, BookableModel, BookableForm, \
                              'admin_edit_bookable', 'admin_bookables');
    pass
