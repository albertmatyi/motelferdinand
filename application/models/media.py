'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db

class MediaModel(AbstractModel):
    content_id = db.IntegerProperty(required=True, default=1)
    title = db.StringProperty(required=False, default='')
    url = db.StringProperty(required=True, default='http://www.google.com')
    typ3 = db.IntegerProperty(required=True, default=1)
