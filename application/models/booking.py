'''
Created on Jul 26, 2012

@author: matyas
'''
from application.models import AbstractModel
from google.appengine.ext import db
from application.models.user import UserModel
from application.models.bookable import BookableModel

class BookingModel(AbstractModel):
    fr0m = db.DateProperty(required=True, auto_now_add=True)
    until = db.DateProperty(required=True, auto_now_add=True)
    places = db.IntegerProperty(required=True, default=1)
    feedback = db.TextProperty()
    accepted = db.BooleanProperty()
    paid = db.BooleanProperty()
    feedback = db.TextProperty()
    user = db.ReferenceProperty(UserModel, collection_name='bookings')
    bookable = db.ReferenceProperty(BookableModel, collection_name='bookings')
    pass
