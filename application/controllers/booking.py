'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app, APP_MAIL_SENDER, APP_ADMIN_MAILS
from application.models import\
    BookingModel,\
    BookableModel,\
    BookingDictBuilder,\
    si18n,\
    UserModel,\
    prop
from application.models.commons import BookingState
from flask.globals import request
from google.appengine.api import mail
from application.decorators import admin_required
from flask.templating import render_template, render_template_string
from application.models.converters import date
from datetime import timedelta
import json
import re
import logging


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
    bkng['guests'] = int(bkng['guests'])
    bkng['start'] = to_date(bkng['start'])
    bkng['end'] = to_date(bkng['end'])
    bkng['bookable'] = BookableModel.get_by_id(long(bkng['bookable']))
    return bkng
    pass


def validate(form):
    msg = ''
    valid = re.search('[\w -]{3,}', form['user']['full_name']) is not None
    valid &= re.search('[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}',
                       form['user']['email']) is not None
    valid &= re.search('[\d+\s\-]{5,}', form['user']['phone']) is not None
    bkng = form['booking']
    tday = bkng['start'].today()
    valid &= bkng['start'] < bkng['end']
    valid &= tday <= bkng['start']
    valid &= bkng['bookable'] is not None

    bookable = bkng['bookable']
    bookings = bookable.get_bookings_that_end_after(bkng['start'])
    bookings = [b for b in bookings if b.start < bkng['end']]
    day = bkng['start']
    while day < bkng['end']:
        q = get_quantity_for_date(day, bookings)
        if q + bkng['quantity'] > bookable.quantity:
            msg = 'Day ' + str(day) + ' is overbooked'
            valid &= False
            break
        day = day + timedelta(days=1)

    if not valid:
        raise Exception('Invalid data. ' + msg)
    pass


def get_quantity_for_date(date, bookings):
    q = 0
    for b in bookings:
        if date >= b.start and date < b.end:
            q += b.quantity
    return q


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
    booking.guests = bkf['guests']
    booking.start = bkf['start']
    booking.end = bkf['end']
    booking.bookable = bkf['bookable']
    map_price(bkf, booking)
    booking.put()
    return booking
    pass


def map_price(bookingForm, booking):
    bk_dict = booking.bookable.get_prices(si18n.get_lang_id())
    vals = bk_dict['values']
    q = int(bookingForm['quantity'])
    g = int(bookingForm['guests'])
    p = booking.bookable.places
    # every room should have at least 1 guest
    price_per_day = float(vals[0]) * q
    # calculate without these guests
    g = max(0, g - q)
    # nr of full rooms
    f = int(g / (p - 1)) if p > 1 else q
    # nr of guests that are not in full rooms
    rg = g % (p - 1) if p > 1 else 0
    # add prices of full rooms
    price_per_day = price_per_day - f * float(vals[0]) + f * float(vals[p - 1])
    # add price_per_day of partially filled room
    price_per_day = price_per_day - float(vals[0]) + float(vals[rg])

    days = (bookingForm['end'] - bookingForm['start']).days
    booking.price = price_per_day * days
    booking.currency = prop.currencies[si18n.get_lang_id()]


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
    message.to = ', '.join(APP_ADMIN_MAILS)
    message.html = render_template(
        '/mail/bookingNewAdmin.html',
        booking=booking_dict
    )
    message.send()
    pass


@app.route('/admin/bookings/accept/<int:entity_id>', methods=['POST'])
@admin_required
def accept_booking(entity_id):
    return set_state_and_mail(entity_id, BookingState.ACCEPTED)


@app.route('/admin/bookings/deny/<int:entity_id>', methods=['POST'])
@admin_required
def deny_booking(entity_id):
    return set_state_and_mail(entity_id, BookingState.DENIED)


@app.route('/admin/bookings/paid/<int:entity_id>', methods=['POST'])
@admin_required
def mark_as_paid(entity_id):
    booking = set_state(entity_id, BookingState.PAID)
    return '{ "message": "' + si18n.translate('Success') + '", ' +\
        '"state": "' + str(booking.state) + '"}'


def set_state_and_mail(entity_id, state):
    booking = set_state(entity_id, state)

    msg = si18n.translate('Mail sent')\
        if send_acceptance_mail(booking)\
        else si18n.translate('Success')

    return '{ "message": "' + msg + '",' +\
        '"state": "' + str(state) + '"}'


def set_state(entity_id, state):
    booking = BookingModel.get_by_id(entity_id)
    if (booking.state, state) in BookingState.transitions:
        booking.state = state
        booking.put()
        return booking
    else:
        raise Exception("Invalid state change.")


def send_acceptance_mail(booking):
    if 'data' not in request.form:
        return False
    mail_data = json.loads(request.form['data'])
    # To client
    message = mail.EmailMessage(
        sender=si18n.translate('Ferdinand Motel') +
        '<' + APP_MAIL_SENDER + '>',
        subject=mail_data['subject']
    )

    message.to = booking.user.full_name + '<' + booking.user.email + '>'
    message.html = mail_data['body']
    message.send()
    return True


@app.route('/booking-mail/<int:entity_id>', methods=['GET'])
@admin_required
def booking_mail(entity_id):
    # pdb.set_trace()
    # mail.send(usr.email, 'BOOKING_SUBJ', '/bookingClient.html', booking);

    body = '/mail/bookingNewClient.html'
    body = '/mail/bookingNewAdmin.html'
    body = '/mail/bookingAcceptedClient.html'
    booking = BookingDictBuilder(long(entity_id))\
        .with_user()\
        .with_bookable()\
        .build()
    return render_template(body, booking=booking)
    pass


@app.route('/admin/bookings/<int:entity_id>', methods=['POST', 'DELETE'])
@admin_required
def admin_delete_booking(entity_id):
    if request.method == 'DELETE' or request.values['_method'] == 'DELETE':
        BookingModel.get_by_id(entity_id).delete()
        return '{ "message" : "' +\
            si18n.translate('Successfully deleted') + '" }'
    return '{ "message" : "' +\
        si18n.translate('Element does not exist') + '" }'


@app.route("/admin/bookings/", methods=["GET"])
@admin_required
def get_bookings():
    bookings = [e.to_dict(True) for e in BookingModel.all()]
    return json.dumps(bookings)


@app.route("/admin/bookings/", methods=["POST"])
@admin_required
def update_booking():
    # pdb.set_trace()
    obj = transform(json.loads(request.form['data']))
    booking = BookingModel.get_by_id(long(obj['id']))
    del obj['user']
    booking.populate(obj).put()

    return '{ "modified" : "' +\
        booking.to_dict()['modified'] +\
        '", "message" : "' + \
        si18n.translate('Modified successfully') + '"}'


def get_or_create_user(user):
    email = user['email']
    usr = UserModel.all().filter('email', email).get()
    if not usr:
        usr = UserModel(
            email=email,
            phone=user['phone'],
            full_name=user['full_name'],
            language=si18n.get_lang_id(),
            citizenship=user['citizenship']
        )
        usr.put()
    else:
        usr.language = si18n.get_lang_id()
        usr.put()
    return usr
