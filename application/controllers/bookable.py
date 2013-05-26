'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from application.decorators import admin_required
from application.models import BookableModel
from application.controllers import helpers
from flask.globals import request
from datetime import datetime
from application.models.converters import date
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
def get_bookings_for_bookable(entity_id):
    bookable = BookableModel.get_by_id(entity_id)
    bookings = bookable.get_bookings_that_end_after(datetime.today())
    bookings = [{
        'start': date.to_str(e.start),
        'end': date.to_str(e.end),
        'quantity': e.quantity
    } for e in bookings]

    return json.dumps(bookings)
