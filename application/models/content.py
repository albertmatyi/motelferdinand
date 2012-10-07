'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractModel
from application.models.category import CategoryModel


class AbstractContentModel(AbstractModel):
    title = db.StringProperty(required=False, default='')
    description = db.TextProperty(required=False, default='')
    order = db.IntegerProperty(required=False, default=0)
    dependencies=['medias']
    
    def __repr__(self, *args, **kwargs):
        return self.title
    
class ContentModel(AbstractContentModel):
    category = db.ReferenceProperty(CategoryModel, collection_name='contents')