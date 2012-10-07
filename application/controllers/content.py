from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers
from flask.templating import render_template

ContentForm = model_form(ContentModel, wtf.Form)

@app.route("/admin/contents/", methods=["GET", "POST"])
def admin_contents():
    helpers.admin_handle_post(ContentModel, ContentForm, 'admin_contents')
    return render_template('contents/list.html', list=ContentModel.all(), properties=ContentModel.properties(), categories=CategoryModel.all())
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
