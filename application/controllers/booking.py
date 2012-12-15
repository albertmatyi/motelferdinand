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
from datetime import datetime
from werkzeug.utils import redirect
import pdb

BookingForm = model_form(BookingModel, wtf.Form)

@app.route("/bookings/", methods=["POST"])
def bookings_new():
    form=helpers.dictify_keys(request.form)
    usr = get_or_create_user(form['user'])

    booking = BookingModel()
    booking.user = usr
    booking.put()
    
    for i in form['bookingEntries']:
        bookable = BookableModel.get_by_id( long ( form['bookingEntries'][i]['bookable_id'] ) )
        quant = int ( form['bookingEntries'][i]['quantity'] ) 
        book_from = datetime.strptime(form['bookingEntries'][i]['book_from'], '%d-%m-%Y').date()
        book_until = datetime.strptime(form['bookingEntries'][i]['book_until'], '%d-%m-%Y').date()
        
        be = BookingEntryModel(bookable = bookable, booking = booking, quantity = quant
            , book_from = book_from, book_until = book_until)
        be.put()
        pass

    return '{ "hello": "world" }';
    pass

def get_or_create_user(user):
    email = user['email']
    usr = UserModel.all().filter('email', email).get()
    if not usr:
        usr = UserModel(email = email, phone = user['phone'], full_name = user['full_name'])
        usr.put()
    return usr

# @app.route("/admin/bookings/<int:mdl_id>", methods=["GET", "POST", "PUT", "DELETE"])
# def admin_edit_booking(mdl_id):
#     return helpers.admin_edit(mdl_id, BookingModel, BookingForm, \
#                               'admin_edit_booking', 'admin_bookings');
#     pass
