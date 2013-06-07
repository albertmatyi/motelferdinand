from application.models.prop import currency_default, currencies
from google.appengine.api.urlfetch import fetch
from xml.etree import ElementTree as etree
from flask import request
import logging


def get_rates():
    xml_string = None
    try:
        ro = fetch('http://www.bnr.ro/nbrfxrates.xml')
        if int(ro.status_code) < 400:
            xml_string = ro.content
    except Exception, e:
        logging.warn('Couldn\'t load currency rates', e)
    if xml_string is None:
        xml_string = rates_string
    tree = etree.fromstring(xml_string)
    rates = {}
    for rate in tree.findall('.//*[@currency]'):
        cur_name = rate.attrib['currency']
        if cur_name in currencies:
            rates[cur_name] = {
                'val': float(rate.text),
                'multiplier':
                int(rate.attrib['multiplier'])
                if 'multiplier' in rate.attrib
                else 1
            }
    rates[currency_default] = {'val': 1, 'multiplier': 1}
    return rates


def get_data():
    return {'default': currency_default,
            'selected': request.cookies.get('currency'),
            'all': currencies,
            'rates': get_rates()}


rates_string = '''<?xml version="1.0" encoding="utf-8"?>
<DataSet xmlns="http://www.bnr.ro/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bnr.ro/xsd nbrfxrates.xsd">
    <Header>
        <Publisher>National Bank of Romania</Publisher>
        <PublishingDate>2013-05-31</PublishingDate>
        <MessageType>DR</MessageType>
    </Header>
    <Body>
        <Subject>Reference rates</Subject>
        <OrigCurrency>RON</OrigCurrency>
        <Cube date="2013-05-31">
            <Rate currency="AED">0.9184</Rate>
            <Rate currency="AUD">3.2318</Rate>
            <Rate currency="BGN">2.2392</Rate>
            <Rate currency="BRL">1.5986</Rate>
            <Rate currency="CAD">3.2595</Rate>
            <Rate currency="CHF">3.5336</Rate>
            <Rate currency="CNY">0.5499</Rate>
            <Rate currency="CZK">0.1699</Rate>
            <Rate currency="DKK">0.5874</Rate>
            <Rate currency="EGP">0.4830</Rate>
            <Rate currency="EUR">4.3794</Rate>
            <Rate currency="GBP">5.1296</Rate>
            <Rate currency="HUF" multiplier="100">1.4764</Rate>
            <Rate currency="INR">0.0595</Rate>
            <Rate currency="JPY" multiplier="100">3.3568</Rate>
            <Rate currency="KRW" multiplier="100">0.2981</Rate>
            <Rate currency="MDL">0.2695</Rate>
            <Rate currency="MXN">0.2615</Rate>
            <Rate currency="NOK">0.5741</Rate>
            <Rate currency="NZD">2.6938</Rate>
            <Rate currency="PLN">1.0201</Rate>
            <Rate currency="RSD">0.0389</Rate>
            <Rate currency="RUB">0.1056</Rate>
            <Rate currency="SEK">0.5091</Rate>
            <Rate currency="TRY">1.7830</Rate>
            <Rate currency="UAH">0.4134</Rate>
            <Rate currency="USD">3.3737</Rate>
            <Rate currency="XAU">152.9066</Rate>
            <Rate currency="XDR">5.0547</Rate>
            <Rate currency="ZAR">0.3317</Rate>
        </Cube>
    </Body>
</DataSet>
'''
