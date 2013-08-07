from application.models.base import AbstractModel
from google.appengine.ext import db
from application.decorators import cached
import json


class PropModel(AbstractModel):
    kkey = db.StringProperty(required=True, default="")
    value = db.TextProperty(required=True, default="")
    description = db.TextProperty(required=True, default=" ")


@cached('all_props')
def get_all_props():
    all_props = {}
    for p in PropModel.all():
        all_props[p.kkey] = p.value
    return all_props


def get_languages():
    all_props = get_all_props()
    if 'languages' not in all_props:
        languages = {'en': 'English'}
    else:
        languages = json.loads(all_props['languages'])
    return languages


def get_currencies():
    all_props = get_all_props()
    if 'currencies' not in all_props:
        currencies = ['EUR', 'RON', 'HUF']
    else:
        currencies = json.loads(all_props['currencies'])
    return currencies


def get_currency_default():
    all_props = get_all_props()
    if 'currencies' not in all_props:
        currency_default = 'RON'
    else:
        currency_default = all_props['currency_default']
    return currency_default
