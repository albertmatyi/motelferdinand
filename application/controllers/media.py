'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers

MediaForm = model_form(MediaModel, wtf.Form)

@app.route("/admin/medias/", methods=["GET", "POST"])
def admin_medias():
    return helpers.admin_list(MediaModel, MediaForm, 'admin_medias')
    pass


@app.route("/admin/medias/new", methods=["GET"])
def admin_new_media():
    return helpers.admin_new(MediaForm, 'admin_medias')
    pass

@app.route("/admin/medias/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
def admin_edit_media(mdl_id):
    return helpers.admin_edit(mdl_id, MediaModel, MediaForm, \
                              'admin_edit_media', 'admin_medias');
    pass
