from application.models.base import AbstractModel
from google.appengine.ext import db


class PropModel(AbstractModel):
    kkey = db.StringProperty(required=True, default="")
    value = db.TextProperty(required=True, default="")
