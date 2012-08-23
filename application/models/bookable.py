'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractContentModel
from application.models.category import CategoryModel

class BookableModel(AbstractContentModel):
    beds=db.IntegerProperty(required=True, default=1)
    category = db.ReferenceProperty(CategoryModel, collection_name='bookables')
    
    dependencies=['bookings']
