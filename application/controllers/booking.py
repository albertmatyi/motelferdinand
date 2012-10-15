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
from flask.globals import request
from flaskext.wtf.form import Form
from flask.helpers import flash
import time
import datetime

BookingFormBase = model_form(BookingModel, wtf.Form, exclude=['fr0m', 'until'])

class BookingForm(BookingFormBase):
    fr0m = DateField('From')
    until = DateField('Until')
    pass

@app.route("/bookings/new", methods=["POST"])
def bookings_new():
    form=request.form
    form.csrf_enabled=False
    db_obj = BookingModel()
    tm = time.strptime(form['bookfrom'], "%d-%m-%Y")
    db_obj.bookfrom = datetime.date(tm.tm_year, tm.tm_mon, tm.tm_mday)
    tm = time.strptime(form['bookuntil'], "%d-%m-%Y")
    db_obj.bookuntil = datetime.date(tm.tm_year, tm.tm_mon, tm.tm_mday)
    db_obj.put()
    flash("Data saved successfully!", "success")
    return 'what'
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
