'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import I18nableModel

class CategoryDummy(object):
    def __init__(self):
        self.title = 'Root'
        pass
    def key(self):
        return self
    def id(self): #@ReservedAssignment
        return ROOT_CAT_ID
    def contains_collections(self):
        return False
    def to_dict(self):
        return {'title': 'Root',
                'contains_collections': 'false',
                'id': ROOT_CAT_ID,
         }
    pass

    
'''
    The virtual id of the root category
'''
ROOT_CAT_ID = -1
'''
    A dummy category object containing the ROOT_CAT_ID (@key().id()) and 
    a title <Root>
'''
ROOT_CAT_DUMMY = CategoryDummy()

class CategoryModel(I18nableModel):

    """Category Model"""
    title = db.StringProperty(required=False, default='')
    description = db.TextProperty(required=False, default='')
    parent_category = db.SelfReferenceProperty(collection_name='subcategories')
    order = db.IntegerProperty(required=False, default=0)
    visible = db.BooleanProperty(required=True, default=False)
    dependencies=['contents', 'subcategories', 'bookables']
    i18d_fields=['title', 'description']
    
    def __repr__(self, *args, **kwargs):
        return self.title
    
    @staticmethod
    def get_root_categories(visibleOnly=True):
        ''' 
        @return: The query for the root 
        '''
        qry = CategoryModel.all().filter('parent_', ROOT_CAT_ID)
        if visibleOnly:
            qry.filter('visible', True)
        return qry 
        pass
    
    def get_path_ids_to_root(self):
        '''
            @see: get_path_to_root
        '''
        ids = [el.key().id() for el in self.get_path_to_root()]
        return ids
        pass
    
    def validate(self):
        '''
            @return: True if all is right, otherwise throws exception
            
        '''
        if self.is_saved() and self in self.get_path_ids_to_root():
            raise CircularCategoryException()
        return True
        pass
    
    def put(self):
        '''
            Overrides the saving to provide an extra validation.
            @return: super.put or throws validation exception
        '''
        if self.validate():
            return super(CategoryModel, self).put()
    
    def get_path_to_root(self):
        '''
            @return: All of the CategoryModel objects starting with its parent
            until the root. (it does not contain self)  
        '''
        if self.parent_category == None:
            return []
        else:
            parent = self.parent_category
            if parent is not None and parent is not self:
                return parent.get_path_to_root() + [parent]
            else:
                return [] 
        pass
    
class CircularCategoryException(Exception):
    def __init__(self):
        self.message = "The category cannot be the subcategory of itself or \
                        of one of its subcategories"
        pass
    pass

