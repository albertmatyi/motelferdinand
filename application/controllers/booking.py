'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from wtforms.ext.appengine.db import model_form
from application.models import * 
from flaskext import wtf
from application.controllers import helpers, user
from flaskext.wtf.html5 import DateField
from flask.globals import request
from flaskext.wtf.form import Form
from flask.helpers import flash, url_for
import time
import datetime
from werkzeug.utils import redirect

BookingForm = model_form(BookingModel, wtf.Form)

@app.route("/bookings/", methods=["POST"])
def bookings_new():
    form=request.form
    form.csrf_enabled=False
    usr = UserModel.create_or_retrieve(form['User-email'], form['User-full_name'])
    print form
    booking = BookingModel()
    booking.user = usr
    booking.put()
    
    # for bookable in BookableModel.all():
        # quant = form['Bookable-'+str(bookable.key().id())+'-quantity']
        # if quant:
        #     be = BookingEntryModel(bookable = bookable, booking = booking, quantity = int( quant ))
        #     be.put()
        #     pass
        # pass

    return '{ hello: "world" }';
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
