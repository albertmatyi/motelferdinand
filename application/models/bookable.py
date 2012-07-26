'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import ContentModel

class BookableModel(ContentModel):
    beds=db.IntegerProperty(required=True, default=1)
