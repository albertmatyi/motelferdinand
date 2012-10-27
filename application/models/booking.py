'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db
from application.models.user import UserModel
from application.models.bookable import BookableModel

class BookingModel(AbstractModel):
    bookfrom = db.DateProperty(required=True, auto_now_add=True)
    bookuntil = db.DateProperty(required=True, auto_now_add=True)
    people = db.IntegerProperty(required=True, default=1)
    feedback = db.TextProperty()
    accepted = db.BooleanProperty()
    paid = db.BooleanProperty()
    user = db.ReferenceProperty(UserModel, collection_name='bookings')
    dependencies=['booking_entries']
    pass

class BookingEntryModel(AbstractModel):
    bookable = db.ReferenceProperty(BookableModel, collection_name='booking_entries')
    quantity = db.IntegerProperty(required=True, default = 1)
    booking = db.ReferenceProperty(BookingModel, collection_name='booking_entries')
    pass