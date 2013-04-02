'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractContentModel
from application.models.category import CategoryModel

class BookableModel(AbstractContentModel):
    beds=db.IntegerProperty(required=True, default=1)
    quantity=db.IntegerProperty(required=True, default=1)
    price=db.IntegerProperty(required=True, default=23)
    category = db.ReferenceProperty(CategoryModel, collection_name='bookables')
    album_url = db.StringProperty(required=False, default='')
    dependencies=['bookings']
    
    def populate_field(self, dictionary, key):
    	if key is 'category':
    		self.category = CategoryModel.get_by_id(long(dictionary[key]))
    	else:
    		super(BookableModel, self).populate_field(dictionary, key)
    	pass