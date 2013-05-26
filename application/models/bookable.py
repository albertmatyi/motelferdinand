'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractContentModel
from application.models.category import CategoryModel
from application.models.commons import BookingState as State
from application.models import prop
import json


class BookableModel(AbstractContentModel):
    '''
        Prices are kept in a structure like:
        {
            en:{
                values: [1,2,3]
            },
            ro:{
                values: [1,2,3]
            }
        }
    '''

    places = db.IntegerProperty(required=True, default=1)
    quantity = db.IntegerProperty(required=True, default=1)
    category = db.ReferenceProperty(CategoryModel, collection_name='bookables')
    album_url = db.StringProperty(required=False, default='')
    prices = db.TextProperty(str)
    dependencies = ['bookings']

    def populate_field(self, dictionary, key):
        if key is 'category':
            self.category = CategoryModel.get_by_id(long(dictionary[key]))
        elif key is 'prices':
            self.validate(dictionary)
            self.prices = json.dumps(dictionary[key])
        else:
            super(BookableModel, self).populate_field(dictionary, key)
        pass

    def validate(self, dictionary):
        pcs = dictionary['prices']
        vn = int(dictionary['places'])
        for lang_id in prop.languages:
            for i in range(vn):
                pcs[lang_id]['values'][i] = float(pcs[lang_id]['values'][i])

    def to_dict_field(self, key):
        if key is 'prices':
            return json.loads(self.prices)
        else:
            return super(BookableModel, self).to_dict_field(key)

    def get_prices(self, lang_id):
        '''
            Retrieves the prices for a give language id in the form
            of a dictionary:
            {
                values: [1,2,3],
            }
        '''
        return self.to_dict()['prices'][lang_id]

    def get_bookings_that_end_after(self, date):
        res = [
            k for k in self.bookings
            .filter('end >', date)
            .filter('state', State.ACCEPTED)
        ]
        res += [
            k for k in self.bookings
            .filter('end >', date)
            .filter('state', State.PAID)
        ]
        return res
