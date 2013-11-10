from google.appengine.ext import db
from application.models.abstract_content import AbstractContentModel
from application.models.bookable import BookableModel


class BookableVariantModel(AbstractContentModel):
    bookable = db.ReferenceProperty(BookableModel, collection_name='bookable_variants')
    i18d_fields = ['description']

    def populate_field(self, dictionary, key):
        if key is 'bookable':
            self.bookable = BookableModel.get_by_id(long(dictionary[key]))
        else:
            super(BookableModel, self).populate_field(dictionary, key)
        pass