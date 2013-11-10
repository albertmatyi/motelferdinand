from application import app
from application.decorators import admin_required
from application.models.bookable_variant import BookableVariantModel
from application.controllers import helpers
from flask.globals import request


@app.route("/admin/bookable_variants/", methods=["POST"])
@admin_required
def admin_bookable_variants():
    return '{ "id" : "' +\
        str(helpers.save_obj_from_req(BookableVariantModel).key().id()) + '" }'
    pass


@app.route('/admin/bookable_variants/<int:entityId>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_bookable_variant(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookableVariantModel.get_by_id(entityId).delete()
        return "{ 'value' : 'OK' }"
    pass
