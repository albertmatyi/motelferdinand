'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers

UserForm = model_form(UserModel, wtf.Form)

@app.route("/admin/users/", methods=["GET", "POST"])
def admin_users():
    return helpers.admin_list(UserModel, UserForm, 'admin_users')
    pass


@app.route("/admin/users/new", methods=["GET"])
def admin_new_user():
    return helpers.admin_new(UserForm, 'admin_users')
    pass

@app.route("/admin/users/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
def admin_edit_user(mdl_id):
    return helpers.admin_edit(mdl_id, UserModel, UserForm, \
                              'admin_edit_user', 'admin_users');
    pass
