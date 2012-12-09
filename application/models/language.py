'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractModel

class LanguageModel(AbstractModel):
    lang_id = db.StringProperty(required=True, default='en')
    name = db.StringProperty(required=True, default='English')
