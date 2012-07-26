'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractModel

class ContentModel(AbstractModel):
    title = db.StringProperty(required=False, default='')
    description = db.TextProperty(required=False, default='')
    category_id = db.IntegerProperty(required=True, default=-1)
