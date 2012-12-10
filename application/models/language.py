'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractModel

class LanguageModel(AbstractModel):
    lang_id = db.StringProperty(required=True, default='en')
    name = db.StringProperty(required=True, default='English')

class I18n(AbstractModel):
	lang_id = db.StringProperty(required=True, default='en')
	field = db.StringProperty(required=True, default='en')
	value = db.StringProperty(required=True, default='en')
	foreign_entity = db.ReferenceProperty(AbstractModel, collection_name='translations')
