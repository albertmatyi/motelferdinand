'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db

class I18nModel(AbstractModel):
    clazz = db.StringProperty(required=True)
    field = db.StringProperty(required=True)
    locale = db.StringProperty(required=True)
    translation = db.TextProperty(required=True)
    pass
