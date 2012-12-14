from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers
from flask.templating import render_template

ContentForm = model_form(ContentModel, wtf.Form)

@app.route("/admin/contents/", methods=["POST"])
def admin_contents():
    return helpers.save_obj_from_req(CategoryModel).key().id();
    pass
