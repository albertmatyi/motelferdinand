'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db
from application.models.user import UserModel
from application.models.bookable import BookableModel

class BookingModel(AbstractModel):
    people = db.IntegerProperty(required=True, default=1)
    feedback = db.TextProperty()
    accepted = db.BooleanProperty(default=False)
    paid = db.BooleanProperty(default=False)
    user = db.ReferenceProperty(UserModel, collection_name='bookings')
    dependencies=['booking_entries']
    def to_dict(self, load_user=False):
        '''
            Override and parametrize the default implementation
            to be able to load (or not) the associated user data.
        '''
        ret = super(BookingModel, self).to_dict()
        if load_user:
            ret['user'] = self.user.to_dict()
        return ret;
        pass
    pass

class BookingEntryModel(AbstractModel):
    bookable = db.ReferenceProperty(BookableModel, collection_name='booking_entries')
    quantity = db.IntegerProperty(required=True, default = 1)
    booking = db.ReferenceProperty(BookingModel, collection_name='booking_entries')
    book_from = db.DateProperty(required=True, auto_now_add=True)
    book_until = db.DateProperty(required=True, auto_now_add=True)
    pass