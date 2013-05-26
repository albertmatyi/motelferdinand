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
    currencies = {'en': 'GBP'}
else:
    languages = json.loads(all_props['languages'])
    currencies = {}
    for l in languages:
        ck = 'currency.' + l
        currencies[l] = all_props[ck] if ck in all_props else '$' + l
