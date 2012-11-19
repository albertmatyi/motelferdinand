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
    booking = BookingModel()
    booking.user = usr
    booking.put()
    
    n = int ( form['BookingEntryN'] )
    for i in range(n):
        i_str = str ( i )  
        bookable = BookableModel.get_by_id( long ( form['BookingEntry['+i_str+'][bookable_id]'] ) )
        quant = int ( form['BookingEntry['+i_str+'][bookable_id]'] ) 
        book_from = form['BookingEntry['+i_str+'][book_from]']
        book_until = form['BookingEntry['+i_str+'][book_until]']
        
        be = BookingEntryModel(bookable = bookable, booking = booking, quantity = quant
            , book_from = book_from, book_until = book_until)
        be.put()
        pass

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
