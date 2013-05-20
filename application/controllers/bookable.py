'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from application.decorators import admin_required
from application.models import BookableModel, BookingModel
from application.controllers import helpers
from flask.globals import request
import json


@app.route("/admin/bookables/", methods=["POST"])
@admin_required
def admin_bookables():
    return '{ "id" : "' +\
        str(helpers.save_obj_from_req(BookableModel).key().id()) + '" }'


@app.route('/admin/bookables/<int:entity_id>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_bookable(entity_id):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookableModel.get_by_id(entity_id).delete()
        return "{ 'value' : 'OK' }"
    pass


@app.route("/bookable/bookings/<int:entity_id>", methods=["GET"])
def get_bookings(entity_id):
    bookings = BookingModel.all().filter('bookable', entity_id).filter('')
    bookings = [e.to_dict(True) for e in bookings]
    return json.dumps(bookings)
