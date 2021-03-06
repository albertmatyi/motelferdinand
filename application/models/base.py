import logging
from google.appengine.ext import db
from datetime import datetime
from application.helpers import date as date_helper


class AbstractModel(db.Model):
    created = db.DateTimeProperty(auto_now_add=True)
    modified = db.DateTimeProperty(auto_now_add=True)

    def to_dict(self):
        '''
            Converts a Model obj, or a model obj array to a dictionary
            (array of dictionaries)
            The method also loads all referenced models
            @return dictionary of values
        '''
        arr = [('id', self.key().id())]

        for key in self.properties():
            val = self.to_dict_field(key)

            arr += [(key, val)]
        if hasattr(self.__class__, 'dependencies'):
            xclusions = self.__class__.to_dict_exclude\
                if hasattr(self.__class__, 'to_dict_exclude')\
                else []
            for dep in self.__class__.dependencies:
                if dep not in xclusions:
                    val = [el.to_dict() for el in getattr(self, dep)]
                    arr += [(dep, val)]
        return dict(arr)

    def to_dict_field(self, key):
        val = getattr(self, key)
        tp = type(val)
        if val is not None and isinstance(
            getattr(self.__class__, key),
            db.ReferenceProperty
        ):
            val = val.key().id()
        elif date_helper.is_date_type(tp):
            val = date_helper.to_str(val)
        else:
            val = unicode(val)
        return val

    def put(self):
        self.modified = datetime.today()
        return super(AbstractModel, self).put()
        pass

    def delete(self):
        '''
            Overrides the default delete behaviour and cascades on
            all dependencies
            @return super.delete()
        '''
        if hasattr(self.__class__, 'dependencies'):
            for dep in self.__class__.dependencies:
                for obj in getattr(self, dep):
                    obj.delete()
        return super(AbstractModel, self).delete()
        pass
    pass

    def populate(self, dictionary, update_refs=False):
        '''
            Populates the properties of the instance from the
            given dictionary
        '''
        for key in self.properties():
            if key in dictionary:
                if isinstance(
                    getattr(self.__class__, key),
                    db.ReferenceProperty
                ):
                    if update_refs and False:
                        getattr(self, key).populate(dictionary[key])
                    self.populate_field(dictionary, key)
                else:
                    self.populate_field(dictionary, key)
                pass
            pass
        return self
        pass

    def populate_field(self, dictionary, key):
        attr_type = type(getattr(self, key))
        val = dictionary[key]
        if key in ["created", "modified"]:
            return
        logging.info("Populate " + key + " with " + str(val))
        valtype = type(val)
        if attr_type in [long, int, float]\
                and valtype not in [long, int, float]:
            val = attr_type(val) if len(val) > 0 else 0
        elif attr_type is bool and valtype is not bool:
            val = val == "True"
        # pdb.set_trace()
        setattr(self, key, val)
