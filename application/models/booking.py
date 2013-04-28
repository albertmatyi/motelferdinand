'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db
from application.models.user import UserModel
from application.models.bookable import BookableModel


class BookingModel(AbstractModel):
    bookable = db.ReferenceProperty(BookableModel, collection_name='bookings')
    user = db.ReferenceProperty(UserModel, collection_name='bookings')
    guests = db.IntegerProperty(required=True, default=1)
    message = db.TextProperty()
    feedback = db.TextProperty()
    currency = db.StringProperty(required=True, default='RON')
    price = db.FloatProperty(required=True, default=99.9)
    accepted = db.BooleanProperty(default=False)
    paid = db.BooleanProperty(default=False)
    quantity = db.IntegerProperty(required=True, default=1)
    book_from = db.DateProperty(required=True, auto_now_add=True)
    book_until = db.DateProperty(required=True, auto_now_add=True)

    def to_dict(self, load_user=False):
        '''
            Override and parametrize the default implementation
            to be able to load (or not) the associated user data.
        '''
        ret = super(BookingModel, self).to_dict()
        if load_user:
            ret['user'] = self.user.to_dict()
        return ret
        pass
    pass


class BookingDictBuilder():

    def __init__(self, el):
        if type(el) is long:
            self.bk = BookingModel.get_by_id(el)
        else:
            self.bk = el
            pass
        self.dct = self.bk.to_dict()
        pass

    def with_user(self):
        self.dct['user'] = self.bk.user.to_dict()
        return self
        pass

    def with_bookable(self):
        self.dct['bookable'] = self.bk.bookable.to_dict()
        return self
        pass

    def build(self):
        return self.dct
    pass
