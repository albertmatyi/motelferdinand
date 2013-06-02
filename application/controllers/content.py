from application import app
from application.decorators import admin_required
from application.models.content import ContentModel
from application.controllers import helpers
from flask.globals import request


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
