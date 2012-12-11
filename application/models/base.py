from google.appengine.ext import db

class AbstractModel(db.Model):
    created = db.DateTimeProperty(auto_now_add=True)
    
    def to_dict(self):
        '''
            Converts a Model obj, or a model obj array to a dictionary (array of dic
            tionaries) 
            The method also loads all referenced models
            @return dictionary of values
        '''
        arr = [('id',self.key().id())]
        
        for key in self.properties():
            val = getattr(self, key)
            if val is not None and isinstance(getattr(self.__class__, key), db.ReferenceProperty):
                val = val.key().id()
            arr += [(key, unicode(val))]
        if hasattr(self.__class__, 'dependencies'):
            for dep in self.__class__.dependencies:
                val = [el.to_dict() for el in getattr(self, dep)]
                arr += [(dep, val)]
        return dict(arr) 
        pass
    
    def delete(self):
        '''
            Overrides the default delete behaviour and cascades on all dependencies
            @return super.delete()
        '''
        if hasattr(self.__class__, 'dependencies'):
            for dep in self.__class__.dependencies:
                for obj in getattr(self, dep):
                    obj.delete()
        return super(AbstractModel, self).delete()
        pass
    pass