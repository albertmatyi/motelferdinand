'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers
from flaskext.wtf.html5 import DateField

BookingFormBase = model_form(BookingModel, wtf.Form, exclude=['fr0m', 'until'])

class BookingForm(BookingFormBase):
    fr0m = DateField('From')
    until = DateField('Until')
    pass

@app.route("/admin/bookings/", methods=["GET", "POST"])
def admin_bookings():
    return helpers.admin_list(BookingModel, BookingForm, 'admin_bookings')
    pass


@app.route("/admin/bookings/new", methods=["GET"])
def admin_new_booking():
    return helpers.admin_new(BookingForm, 'admin_bookings')
    pass

@app.route("/admin/bookings/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
def admin_edit_booking(mdl_id):
    return helpers.admin_edit(mdl_id, BookingModel, BookingForm, \
                              'admin_edit_booking', 'admin_bookings');
    pass
