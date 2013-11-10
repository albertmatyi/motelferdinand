'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models.abstract_content import AbstractContentModel
from application.models.category import CategoryModel
from application.models.commons import BookingState as State
from application.helpers.date import validate_date
import json

SPECIAL_PRICE_REPEAT_VALUES = ['no', 'month', 'week', 'year']


class BookableModel(AbstractContentModel):
    '''
        Prices are kept in a structure like:
        {
            values: [1,2,3]
        }
    '''

    places = db.IntegerProperty(required=True, default=1)
    quantity = db.IntegerProperty(required=True, default=1)
    category = db.ReferenceProperty(CategoryModel, collection_name='bookables')
    album_url = db.StringProperty(required=False, default='')
    prices = db.TextProperty(str)
    dependencies = ['bookings', 'bookable_variants']
    to_dict_exclude = ['bookings']
    i18d_fields = ['title']

    def populate_field(self, dictionary, key):
        if key is 'category':
            self.category = CategoryModel.get_by_id(long(dictionary[key]))
        elif key is 'prices':
            self.validate_prices_for(
                int(dictionary['places']),
                dictionary['prices'])
            self.prices = json.dumps(dictionary[key])
        else:
            super(BookableModel, self).populate_field(dictionary, key)
        pass

    def validate_prices_for(self, places, prices):
        self.validate_price_values_for(places, prices['values'])
        specials = len(prices['special'])
        for i in range(specials):
            special = prices['special'][i]
            self.validate_price_values_for(places, special['values'])
            validate_date(special['start'])
            validate_date(special['end'])
            if special['repeat'] not in SPECIAL_PRICE_REPEAT_VALUES:
                raise Exception('Invalid repeat value: ' + special['repeat'])

    def validate_price_values_for(self, places, values):
        for i in range(places):
            values[i] = float(values[i])

    def to_dict_field(self, key):
        if key is 'prices':
            return json.loads(self.prices) if self.prices else {}
        else:
            return super(BookableModel, self).to_dict_field(key)

    def get_prices(self):
        '''
            Retrieves the prices for a give language id in the form
            of a dictionary:
            {
                values: [1,2,3],
            }
        '''
        return self.to_dict()['prices']

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
