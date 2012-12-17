from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers
from flask.templating import render_template
from flask.globals import request

@app.route("/admin/contents/", methods=["POST"])
def admin_contents():
    return str(helpers.save_obj_from_req(ContentModel).key().id());
    pass

@app.route('/admin/contents/<int:entityId>', methods=['POST', 'DELETE'])
def admin_delete_content(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        ContentModel.get_by_id(entityId).delete()
        return "{ 'value' : 'OK' }"
    pass