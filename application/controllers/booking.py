'''
Created on Jul 26, 2012

@author: matyas
'''
from application import app
from application.models.booking import BookingModel
from application.models.bookable import BookableModel
from application.models.user import UserModel
from application.models.commons import BookingState
from application.helpers import si18n, mail as mail_helper
from flask.globals import request
from application.decorators import admin_required
from application.helpers import date as date_helper
from datetime import timedelta
from application.helpers import currency as currency_helper,\
    price as price_helper
import json
import re
import logging


@app.route("/bookings/", methods=["POST"])
def save_new_booking():
    data = json.loads(request.form['data'])
    logging.info('save booking data: ' + str(data))
    transform(data['booking'])
    bk_data = data['booking']
    validate_user(data['user'])
    validate_booking(bk_data)

    booking = BookingModel()
    usr = get_or_create_user(data['user'])
    booking.user = usr
    map_booking_data(bk_data, booking)
    booking.put()

    mail_helper.send_mails_for_new(booking)
    return '{ "message": "' +\
        si18n.translate(
            'Booking successfully saved! ' +
            'Stand by for a confirmation email.') +\
        '" , "success" : true }'
    pass


@admin_required
@app.route('/admin/bookings/', methods=['POST'])
def save_booking():
    booking_in = json.loads(request.form['data'])

    if booking_in['id']:
        booking = BookingModel.get_by_id(long(booking_in['id']))
        booking.discount = float(booking_in['discount'])
    else:
        raise Exception(" Not implemented")

    booking.put()

    return '{ "message": "Booking successfully saved!", "success" : true }'
    pass


@app.route('/admin/booking/valid/<int:booking_id>', methods=['GET'])
def booking_is_valid(booking_id):
    booking = BookingModel.get_by_id(booking_id)

    return is_valid_quantity_for_range(
        booking.bookable,
        booking.start,
        booking.end,
        booking.quantity)


@app.route('/admin/bookings/accept/<int:entity_id>', methods=['POST'])
@admin_required
def accept_booking(entity_id):
    return set_state_and_mail(
        entity_id,
        BookingState.ACCEPTED,
        check_overbooking)


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


@app.route('/booking-mail/<typ>/<int:entity_id>', methods=['GET'])
@admin_required
def booking_mail(typ, entity_id):
    return mail_helper.render_mail_template(
        typ,
        mail_helper.build_booking_info(long(entity_id))
    )[1]
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


@app.route("/admin/bookings/<start_date>/<end_date>", methods=["GET"])
@admin_required
def get_bookings(start_date, end_date):
    bookings =\
        [e.to_dict(True)
            for e in get_new_bookings(start_date, end_date)]
    return json.dumps(bookings)


def get_new_bookings(start_date, end_date):
    qry = BookingModel.all()
    if not start_date == 'NaN':
        qry.filter('end >=', date_helper.to_date(start_date))
    if not end_date == 'NaN':
        qry.filter('end <=', date_helper.to_date(end_date))
    return qry


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


def transform(bkng):
    to_date = lambda sstr: date_helper.to_date(sstr)
    bkng['quantity'] = int(bkng['quantity'])
    bkng['guests'] = int(bkng['guests'])
    bkng['start'] = to_date(bkng['start'])
    bkng['end'] = to_date(bkng['end'])
    bkng['bookable'] = BookableModel.get_by_id(long(bkng['bookable']))
    return bkng
    pass


def validate_user(user):
    valid = re.search('[\w -]{3,}', user['full_name']) is not None
    valid &= re.search('[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}',
                       user['email']) is not None
    valid &= re.search('[\d+\s\-]{5,}', user['phone']) is not None
    if not valid:
        raise Exception('Invalid data.')
    pass


def validate_booking(booking):
    tday = booking['start'].today()
    valid = booking['start'] < booking['end']
    valid &= tday <= booking['start']
    valid &= booking['bookable'] is not None

    bookable = booking['bookable']
    valid &= is_valid_quantity_for_range(
        bookable,
        booking['start'],
        booking['end'],
        booking['quantity'])
    if not valid:
        raise Exception('Invalid data.')


def is_valid_quantity_for_range(bookable, start, end, quantity):
    bookings = bookable.get_bookings_that_end_after(start)
    bookings = [b for b in bookings if b.start < end]
    day = start
    while day < end:
        q = get_quantity_for_date(day, bookings)
        if q + quantity > bookable.quantity:
            return False
        day = day + timedelta(days=1)
    return True


def get_quantity_for_date(date, bookings):
    q = 0
    for b in bookings:
        if date >= b.start and date < b.end:
            q += b.quantity
    return q


def map_booking_data(bkf, booking):
    booking.message = bkf['message']
    booking.quantity = bkf['quantity']
    booking.guests = bkf['guests']
    booking.start = bkf['start']
    booking.end = bkf['end']
    booking.bookable = bkf['bookable']
    map_price(bkf, booking)


def map_price(bookingForm, booking):

    booking.price = price_helper.get_price_for(
        json.loads(booking.bookable.prices),
        booking.quantity,
        booking.guests,
        booking.start,
        booking.end)
    booking.currency = currency_helper.get_selected_currency()
    booking.rates = json.dumps(currency_helper.get_rates())


def check_overbooking(booking, new_state):

    if booking.state is BookingState.INITIAL and\
        new_state is BookingState.ACCEPTED and\
        not is_valid_quantity_for_range(
            booking.bookable,
            booking.start,
            booking.end,
            booking.quantity):
        raise Exception('Range is overbooked')


def set_state_and_mail(entity_id, state, validator=lambda b, ns: None):
    booking = set_state(entity_id, state, validator)
    if 'data' not in request.form:
        return '{ "message": "' + si18n.translate('Success') + '",' +\
               '"state": "' + str(state) + '"}'

    mail_data = json.loads(request.form['data'])
    mail_helper.send_acceptance_mail(booking, mail_data)
    si18n.translate('Mail sent')
    return '{ "message": "' + si18n.translate('Success') + '",' +\
           '"state": "' + str(state) + '"}'


def set_state(entity_id, state, validator=lambda b, ns: None):
    booking = BookingModel.get_by_id(entity_id)
    if (booking.state, state) in BookingState.transitions:
        validator(booking, state)
        booking.state = state
        booking.put()
        return booking
    else:
        raise Exception("Invalid state change.")


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
