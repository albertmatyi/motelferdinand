'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from application.models import\
    BookingModel,\
    BookableModel,\
    BookingDictBuilder,\
    si18n,\
    UserModel
from flask.globals import request
from google.appengine.api import mail
from application.decorators import admin_required
from flask.templating import render_template, render_template_string
from application.models.converters import date
import json
import re
import logging

APP_MAIL_SENDER =\
    'albertmatyi@gmail.com'
APP_ADMIN_MAILS =\
    'Owner <zozipus@yahoo.com>, Developer <albertmatyi@gmail.com>'


@app.route("/bookings/", methods=["POST"])
def bookings_new():
    booking = save_booking()

    send_new_booking_mail(booking)
    return '{ "message": "Booking successfully saved!' +\
        ' Stand by for a confirmation email." , "success" : true }'
    pass


def transform(bkng):
    to_date = lambda sstr: date.to_obj(sstr)
    bkng['quantity'] = int(bkng['quantity'])
    bkng['book_from'] = to_date(bkng['book_from'])
    bkng['book_until'] = to_date(bkng['book_until'])
    bkng['bookable'] = BookableModel.get_by_id(long(bkng['bookable']))
    return bkng
    pass


def validate(form):
    # pdb.set_trace()
    valid = re.search('[\w -]{3,}', form['user']['full_name']) is not None
    valid &= re.search('[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}',
                       form['user']['email']) is not None
    valid &= re.search('[\d+\s\-]{5,}', form['user']['phone']) is not None
    bkng = form['booking']
    tday = bkng['book_from'].today()
    valid &= bkng['book_from'] < bkng['book_until']
    valid &= tday <= bkng['book_from']
    valid &= bkng['bookable'] is not None

    if not valid:
        raise ValidationException('Invalid data')
    pass


class ValidationException(Exception):
    pass


def save_booking():
    # pdb.set_trace()
    form = json.loads(request.form['data'])
    logging.info('save booking form: ' + str(form))
    transform(form['booking'])
    validate(form)

    usr = get_or_create_user(form['user'])
    bkf = form['booking']
    booking = BookingModel()
    booking.message = bkf['message']
    booking.user = usr
    booking.quantity = bkf['quantity']
    booking.book_from = bkf['book_from']
    booking.book_until = bkf['book_until']
    booking.bookable = bkf['bookable']
    booking.put()
    return booking
    pass


def send_new_booking_mail(booking):
    subject = 'Your booking request at Ferdinand Motel '
    booking_dict = BookingDictBuilder(booking)\
        .with_user()\
        .with_bookable()\
        .build()
    # To client
    message = mail.EmailMessage(sender=si18n.translate('Ferdinand Motel') +
                                '<' + APP_MAIL_SENDER + '>',
                                subject=render_template_string(
                                    subject,
                                    booking=booking_dict)
                                )

    message.to = booking.user.full_name + '<' + booking.user.email + '>'
    message.html = render_template(
        '/mail/bookingNewClient.html',
        booking=booking_dict
    )
    message.send()

    # To admin
    subject = 'A new reservation has been made - Ferdinand Motel'
    message.subject = render_template_string(subject, booking=booking_dict)
    message.to = APP_ADMIN_MAILS
    message.html = render_template(
        '/mail/bookingNewAdmin.html',
        booking=booking_dict
    )
    message.send()
    pass


@app.route('/booking-mail/<int:entityId>', methods=['GET'])
@admin_required
def booking_mail(entityId):
    # pdb.set_trace()
    # mail.send(usr.email, 'BOOKING_SUBJ', '/bookingClient.html', booking);

    # body = '/mail/bookingClient.html'
    body = '/mail/bookingNewClient.html'
    # body = '/mail/bookingAcceptedClient.html'
    booking = BookingDictBuilder(long(entityId))\
        .with_user()\
        .with_bookable()\
        .build()
    return render_template(body, booking=booking)
    pass


@app.route('/admin/bookings/<int:entityId>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_booking(entityId):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookingModel.get_by_id(entityId).delete()
        return '{ "message" : "' +\
            si18n.translate('Successfully deleted') + '" }'
    return '{ "message" : "' +\
        si18n.translate('Element does not exist') + '" }'


@app.route("/admin/bookings/", methods=["POST"])
@admin_required
def update_booking():
    # pdb.set_trace()
    obj = transform(json.loads(request.form['data']))
    booking = BookingModel.get_by_id(long(obj['id']))
    accepted0 = booking.accepted
    del obj['user']
    booking.populate(obj).put()
    if accepted0 is False and booking.accepted is True:
        send_booking_accepted_mail(booking)

    return '{ "modified" : "' +\
        booking.to_dict()['modified'] +\
        '", "message" : "' + \
        si18n.translate('Modified successfully') + '"}'


def send_booking_accepted_mail(booking):
    subject = 'Your booking request at Ferdinand Motel has been ACCEPTED.'
    booking_dict = booking.to_dict(True)
    # To client
    message = mail.EmailMessage(
        sender=si18n.translate('Ferdinand Motel') +
        '<' + APP_MAIL_SENDER + '>',
        subject=render_template_string(
            subject,
            booking=booking_dict
        )
    )

    message.to = booking.user.full_name + '<' + booking.user.email + '>'
    message.html = render_template(
        '/mail/bookingAcceptedClient.html',
        booking=booking_dict
    )
    message.send()


def get_or_create_user(user):
    email = user['email']
    usr = UserModel.all().filter('email', email).get()
    if not usr:
        usr = UserModel(
            email=email,
            phone=user['phone'],
            full_name=user['full_name']
        )
        usr.put()
    return usr
