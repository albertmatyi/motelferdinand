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
from application.decorators import admin_required
from flask.templating import render_template, render_template_string
import json
import pdb
import re
import logging

BookingForm = model_form(BookingModel, wtf.Form)
APP_MAIL_SENDER = 'albertmatyi@gmail.com'
APP_ADMIN_MAILS = 'Owner <zozipus@yahoo.com>, Developer <albertmatyi@gmail.com>'

@app.route("/bookings/", methods=["POST"])
def bookings_new():
    booking = save_booking()

    send_new_booking_mail(BookingModel.get_by_id(booking.key().id()))
    return '{ "message": "Booking successfully saved! Stand by for a confirmation email." , "success" : true }'
    pass

def transform(form):
    for be in form['bookingEntries']:
        to_date = lambda sstr: datetime.strptime(sstr, '%d-%m-%Y').date()
        be['bookable_id'] = long (be['bookable_id']) 
        be['quantity'] = int (be['quantity']) 
        be['book_from'] = to_date(be['book_from'])
        be['book_until'] = to_date(be['book_until'])
    pass

def validate(form):
    # pdb.set_trace()
    valid = re.search('[\w -]{3,}', form['user']['full_name']) is not None
    valid &= re.search('[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}', form['user']['email']) is not None
    valid &= re.search('[\d+\s\-]{5,}', form['user']['phone']) is not None
    valid &= len(form['bookingEntries']) > 0
    for be in form['bookingEntries']:
        tday = be['book_from'].today()
        valid &= be['book_from'] < be['book_until']
        valid &= tday <= be['book_from'] 
        pass

    if not valid:
        raise ValidationException('Invalid data');
    pass

class ValidationException(Exception) :
    pass

def save_booking():
    # pdb.set_trace()
    form=json.loads(request.form['data'])
    logging.info('save booking form: '+ str(form))
    transform(form)
    validate(form)

    usr = get_or_create_user(form['user'])

    booking = BookingModel()
    booking.user = usr
    booking.put()
    
    for bef in form['bookingEntries']:
        bookable = BookableModel.get_by_id( bef['bookable_id'] )
        quant = bef['quantity'] 
        book_from = bef['book_from']
        book_until = bef['book_until']
        
        be = BookingEntryModel(bookable = bookable, booking = booking, quantity = quant
            , book_from = book_from, book_until = book_until)
        be.put()
        pass
    return booking 
    pass

def send_new_booking_mail(booking):
    subject = 'Your booking request at Ferdinand Motel '
    booking_dict = booking.to_dict(True, True)
    # To client
    message = mail.EmailMessage(sender=si18n.translate('Ferdinand Motel')+'<'+APP_MAIL_SENDER+'>',
                            subject=render_template_string(subject, booking=booking_dict))

    message.to = booking.user.full_name + '<'+booking.user.email+'>'
    message.html = render_template('/mail/bookingNewClient.html', booking=booking_dict)
    message.send()
    
    # To admin
    subject = 'A new reservation has been made - Ferdinand Motel'
    message.subject = render_template_string(subject, booking=booking_dict)
    message.to = APP_ADMIN_MAILS
    message.html = render_template('/mail/bookingNewAdmin.html', booking=booking_dict)
    message.send()
    pass

@app.route('/booking-mail/<int:entityId>', methods=['GET'])
@admin_required
def booking_mail(entityId):
    booking = BookingModel.get_by_id(long(entityId));
    # pdb.set_trace()
    # mail.send(usr.email, 'BOOKING_SUBJ', '/bookingClient.html', booking);
    
    body = '/mail/bookingClient.html'
    body = '/mail/bookingNewClient.html'
    body = '/mail/bookingAcceptedClient.html'
    return render_template(body, booking=booking.to_dict(True, True))
    pass

@app.route('/admin/bookings/<int:entityId>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_booking(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookingModel.get_by_id(entityId).delete()
        return '{ "message" : "'+si18n.translate('Successfully deleted')+'" }'
    pass

@app.route("/admin/bookings/", methods=["POST"])
@admin_required
def update_booking():
    # pdb.set_trace()
    obj = json.loads(request.form['data'])
    booking = BookingModel.get_by_id(long(obj['id']))
    accepted0 = booking.accepted
    del obj['user']
    booking.populate(obj).put()
    if accepted0 is False and booking.accepted is True:
        send_booking_accepted_mail(booking)

    return '{ "modified" : "'+booking.to_dict()['modified']+'", "message" : "' + \
        si18n.translate('Modified successfully') +'"}'
    pass

def send_booking_accepted_mail(booking):
    subject = 'Your booking request at Ferdinand Motel has been ACCEPTED.'
    booking_dict = booking.to_dict(True, True)
    # To client
    message = mail.EmailMessage(sender=si18n.translate('Ferdinand Motel')+'<'+APP_MAIL_SENDER+'>',
                            subject=render_template_string(subject, booking=booking_dict))

    message.to = booking.user.full_name + '<'+booking.user.email+'>'
    message.html = render_template('/mail/bookingAcceptedClient.html', booking=booking_dict)
    message.send()


def get_or_create_user(user):
    email = user['email']
    usr = UserModel.all().filter('email', email).get()
    if not usr:
        usr = UserModel(email = email, phone = user['phone'], full_name = user['full_name'])
        usr.put()
    return usr

