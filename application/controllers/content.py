from application import app
from application.decorators import admin_required
from application.models.content import ContentModel
from application.models.category import CategoryModel
from application.controllers import helpers
from application.helpers import request as request_helper
from flask.globals import request
import json


@app.route("/admin/contents/", methods=["POST"])
@admin_required
def admin_contents():
    return '{ "id" : "' +\
        str(helpers.save_obj_from_req(ContentModel).key().id()) + '" }'
    pass


@app.route('/admin/contents/<int:entityId>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_content(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        ContentModel.get_by_id(entityId).delete()
        return "{ 'value' : 'OK' }"
    pass


@app.route('/admin/content/move/<int:entityId>', methods=['POST'])
@admin_required
def admin_move_content(entityId):
    content = ContentModel.get_by_id(entityId)
    jsd = request_helper.get_json_data()
    content.category = CategoryModel.get_by_id(long(jsd['category_id']))
    content.put()
    return json.dumps(content.to_dict())
