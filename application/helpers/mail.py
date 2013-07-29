# -*- coding: utf-8 -*-
from google.appengine.api import mail
from application.helpers import si18n, currency
from application.models.booking import BookingDictBuilder
from application.models.prop import all_props
import re
import json
import math


def send_mails_for_new(booking):
    subject = 'Your booking request at Ferdinand Motel '
    # To client
    booking_info = build_booking_info(booking)
    (subject, body) = render_mail_template('new_client', booking_info)

    send_mail(
        si18n.translate('Ferdinand Motel') + '<' + get_sender() + '>',
        booking.user.full_name + '<' + booking.user.email + '>',
        subject,
        body)

    (subject, body) = render_mail_template('new_admin', booking_info)

    send_mail(
        si18n.translate('Ferdinand Motel') + '<' + get_sender() + '>',
        ', '.join(get_admin_mails()),
        subject,
        body)
    pass


def send_acceptance_mail(booking, mail_data):
    # To client
    message = mail.EmailMessage(
        sender=si18n.translate('Ferdinand Motel') +
        '<' + get_sender() + '>',
        subject=mail_data['subject']
    )

    message.to = booking.user.full_name + '<' + booking.user.email + '>'
    message.html = mail_data['body']
    message.send()


def build_booking_info(booking):
    bldr = BookingDictBuilder(booking)\
        .with_user()\
        .with_bookable()
    booking = bldr.bk
    bi = bldr.build()

    nights = (booking.end - booking.start).days

    bi['currencyClient'] = bi['currency']
    bi['priceClient'] =\
        currency.convert(
            booking.price,
            bi['currency'],
            json.loads(booking.rates))
    bi['pricePerNightClient'] = math.ceil(bi['priceClient'] / nights)
    bi['priceClient'] = bi['pricePerNightClient'] * nights
    bi['nrOfNights'] = nights

    return bi


def render_mail_template(which, booking_info):
    key_base = 'mail.' + which + '.' + si18n.get_lang_id()
    subject_template = unicode(all_props[key_base + '.subject'])
    body_template = unicode(all_props[key_base + '.body'])

    return (
        render(subject_template, booking_info),
        render(body_template, booking_info)
    )


def render(string, booking_info):
    lang_id = si18n.get_lang_id()
    string = iterate_and_replace(string, 'user', booking_info['user'])
    string = iterate_and_replace(
        string,
        'bookable.i18n',
        booking_info['bookable']['i18n'][lang_id])
    string = iterate_and_replace(string, 'bookable', booking_info['bookable'])
    string = iterate_and_replace(string, 'booking', booking_info)
    return string


def iterate_and_replace(string, base, dct):
    for k in dct:
        rk = r'#' + base + r'\.' + k + r'\b'
        string = re.sub(rk, unicode(dct[k]), string)
    return string


def send_mail(ffrom, to, subject, body):
    message = mail.EmailMessage(sender=ffrom, subject=subject)
    message.to = to
    message.html = body
    message.send()


def get_sender():
    return 'albertmatyi@gmail.com'


def get_admin_mails():
    return [
        'Developer <albertmatyi@gmail.com>',
        ', Owner <zozipus@yahoo.com>'
    ]
