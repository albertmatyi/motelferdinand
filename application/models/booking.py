'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models.base import AbstractModel
from google.appengine.ext import db
from application.models.user import UserModel
from application.models.commons import BookingState as State
from application.models.bookable import BookableModel
from application.models.prop import currency_default


class BookingModel(AbstractModel):

    bookable = db.ReferenceProperty(BookableModel, collection_name='bookings')
    user = db.ReferenceProperty(UserModel, collection_name='bookings')
    guests = db.IntegerProperty(required=True, default=1)
    message = db.TextProperty()
    feedback = db.TextProperty()
    # the currency the booking was made in
    currency = db.StringProperty(required=True, default=currency_default)
    # the rates of that day
    rates = db.StringProperty(required=True, default='{ "error": "not saved"}')
    # the price of the stay in the default currency
    price = db.FloatProperty(required=True, default=99.9)
    # disctoun over the total price
    discount = db.FloatProperty(required=True, default=0.0)
    state = db.IntegerProperty(required=True, default=State.INITIAL)
    quantity = db.IntegerProperty(required=True, default=1)
    start = db.DateProperty(required=True, auto_now_add=True)
    end = db.DateProperty(required=True, auto_now_add=True)

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

    @staticmethod
    def get_number_of_new():
        return BookingModel.all().filter('state', State.INITIAL).count()


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
