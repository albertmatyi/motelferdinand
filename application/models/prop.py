from application.models.base import AbstractModel
from google.appengine.ext import db
import json


class PropModel(AbstractModel):
    kkey = db.StringProperty(required=True, default="")
    value = db.TextProperty(required=True, default="")

all_props = {}
for p in PropModel.all():
    all_props[p.kkey] = p.value


if 'languages' not in all_props:
    languages = {'en': 'English'}
else:
    languages = json.loads(all_props['languages'])

if 'currencies' not in all_props:
    currencies = ['EUR', 'RON', 'HUF']
    currency_default = 'RON'
else:
    currencies = json.loads(all_props['currencies'])
    currency_default = all_props['currency_default']
