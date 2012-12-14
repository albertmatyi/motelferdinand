from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers
from flask.templating import render_template

@app.route("/admin/contents/", methods=["POST"])
def admin_contents():
    return str(helpers.save_obj_from_req(ContentModel).key().id());
    pass
