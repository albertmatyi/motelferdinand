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
from google.appengine.api import mail
from flask.templating import render_template, render_template_string
import json
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
    send_new_booking_mail(booking)
    return '{ "hello": "world" }';
    pass

def send_new_booking_mail(booking):
    subject = 'Your booking request at Ferdinand Motel '
    body = '/mail/bookingClient.html'
    message = mail.EmailMessage(sender=si18n.translate('Ferdinand Motel')+'<no-reply@ferdinandmotel.appspot.com>',
                            subject=render_template_string(subject, booking=booking.to_dict(True)))

    message.to = booking.user.full_name + '<'+booking.user.email+'>'
    message.html = render_template(body, booking=booking.to_dict(True, True))
    message.send()
    pass

@app.route('/booking-mail/<int:entityId>', methods=['GET'])
def booking_mail(entityId):
    booking = BookingModel.get_by_id(long(entityId));
    # pdb.set_trace()
    # mail.send(usr.email, 'BOOKING_SUBJ', '/bookingClient.html', booking);
    
    body = '/mail/bookingClient.html'
    return render_template(body, booking=booking.to_dict(True, True)) + \
        render_template_string(subject, booking=booking.to_dict(True))
    pass

@app.route('/admin/bookings/<int:entityId>', methods=['POST', 'DELETE'])
def admin_delete_booking(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookingModel.get_by_id(entityId).delete()
        return "{ 'value' : 'OK' }"
    pass

@app.route("/admin/bookings/", methods=["POST"])
def update_booking():
    # pdb.set_trace()
    obj = json.loads(request.form['data'])
    db_obj = BookingModel.get_by_id(long(obj['id']))
    db_obj.populate(obj).put()
    return '{ "modified" : "'+db_obj.to_dict()['modified']+'"}'
    pass

def get_or_create_user(user):
    email = user['email']
    usr = UserModel.all().filter('email', email).get()
    if not usr:
        usr = UserModel(email = email, phone = user['phone'], full_name = user['full_name'])
        usr.put()
    return usr

