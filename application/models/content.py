'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import I18nableModel
from application.models.category import CategoryModel


class AbstractContentModel(I18nableModel):
    order = db.IntegerProperty(required=False, default=0)
    i18d_fields=['title', 'description']
    
class ContentModel(AbstractContentModel):
    category = db.ReferenceProperty(CategoryModel, collection_name='contents')
    
    def populate_field(self, dictionary, key):
    	if key is 'category':
    		self.category = CategoryModel.get_by_id(long(dictionary[key]))
    	else:
    		super(ContentModel, self).populate_field(dictionary, key)
    	pass