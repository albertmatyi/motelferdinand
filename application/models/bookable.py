'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractContentModel
from application.models.category import CategoryModel
from application.models.i18n import LanguageModel


class BookableModel(AbstractContentModel):
    '''
        Prices are kept in a structure (for 3 places:

        [en, EUR, 1, 2, 3, ro, RON, 3, 2, 1]

        But got(populate) and returned (to_dict_field) like:
        {
            en:{
                currency: EUR,
                values: [1,2,3]
            },
            ro:{
                currency: RON,
                values: [1,2,3]
            }
        }
    '''

    places = db.IntegerProperty(required=True, default=1)
    quantity = db.IntegerProperty(required=True, default=1)
    category = db.ReferenceProperty(CategoryModel, collection_name='bookables')
    album_url = db.StringProperty(required=False, default='')
    prices = db.ListProperty(str)
    dependencies = ['bookings']

    def populate_field(self, dictionary, key):
        if key is 'category':
            self.category = CategoryModel.get_by_id(long(dictionary[key]))
        elif key is 'prices':
            arr = []
            pcs = dictionary[key]
            vn = int(dictionary['places'])
            for lang in LanguageModel.all():
                lid = lang.lang_id
                arr += [lid]
                arr += [pcs[lid]['currency']]
                for i in range(vn):
                    arr += [pcs[lid]['values'][i]]
            self.prices = arr
        else:
            super(BookableModel, self).populate_field(dictionary, key)
        pass

    def to_dict_field(self, key):
        if key is 'prices':
            d = {}
            it = iter(self.prices)
            while True:
                try:
                    d1 = {}
                    d[it.next()] = d1               # put langid
                    d1['currency'] = it.next()      # put currency
                    vs = []
                    d1['values'] = vs
                    for i in range(self.places):    # put all price values
                        vs += [it.next()]
                except StopIteration:
                    break
            return d
        else:
            return super(BookableModel, self).to_dict_field(key)
