from application.models.i18n import I18nableModel
from google.appengine.ext import db


class AbstractContentModel(I18nableModel):
    weight = db.IntegerProperty(required=False, default=0)
    i18d_fields = ['title', 'description']
