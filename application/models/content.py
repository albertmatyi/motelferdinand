'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models.category import CategoryModel
from application.models.abstract_content import AbstractContentModel


class ContentModel(AbstractContentModel):
    category = db.ReferenceProperty(CategoryModel, collection_name='contents')

    def populate_field(self, dictionary, key):
        if key is 'category':
            self.category = CategoryModel.get_by_id(long(dictionary[key]))
        else:
            super(ContentModel, self).populate_field(dictionary, key)
