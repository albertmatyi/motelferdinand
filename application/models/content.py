'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import I18nableModel
from application.models.category import CategoryModel


class AbstractContentModel(I18nableModel):
    order = db.IntegerProperty(required=False, default=0)
    dependencies=['medias']
    i18d_fields=['title', 'description']
    
    def __repr__(self, *args, **kwargs):
        return self.title
    
class ContentModel(AbstractContentModel):
    category = db.ReferenceProperty(CategoryModel, collection_name='contents')