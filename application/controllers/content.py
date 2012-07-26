from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers

ContentForm = model_form(ContentModel, wtf.Form)

@app.route("/admin/contents/", methods=["GET", "POST"])
def admin_contents():
    return helpers.admin_list(ContentModel, ContentForm, 'admin_contents')
    pass


@app.route("/admin/contents/new", methods=["GET"])
def admin_new_content():
    return helpers.admin_new(ContentForm, 'admin_contents')
    pass

@app.route("/admin/contents/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
def admin_edit_content(mdl_id):
    return helpers.admin_edit(mdl_id, ContentModel, ContentForm, \
                              'admin_edit_content', 'admin_contents');
    pass
