'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from random import Random

class AbstractModel(db.Model):
    created = db.DateTimeProperty(auto_now_add=True)
    pass

def init_db():
    ''' 
        Deletes existing categories and creates new ones
        with a random number of subcategories that are or are not non-menu-entries
    '''
    
    for cat in CategoryModel.all():
        cat.delete()
        pass
    
    titles = ['Ferdinand motel', 'Booking', 'Guestbook', 'Location',
              'Rooms', 'Restaurants', 'Sightseeing',
              'Partners', 'Documents', 'About']
    cc = 0
    for title in titles:
        key = CategoryModel(visible=True, title=title, parent_id= -1, contains_collections=cc % 2 is 0).put()
        cc += 1
        # add random number of subcategories
        for _ in range(0, Random().randint(2, 10)):
            CategoryModel(visible=True,
                          title=get_random_text(Random().randint(10, 15)).replace('\n', '')
                          .capitalize(), parent_id=key.id()).put()
            pass
    pass

def get_random_text(length):
    if length > len(fixieText):
        return fixieText
    start = Random().randint(20, len(fixieText) - length)
    start = fixieText.find(' ', start - 20) + 1
    return fixieText[start : start + length].capitalize()
    pass

fixieText = '''Rado 1982 is classy gluten-free ethical esse authentic nulla. Bennie dumpster art reprehenderit DSLR whatever esse. Kale fresh trust-fund vegan beer wes reprehenderit delectus. Kale mollit magna polaroid.

    Instagram anime party ethical
    Bushwick salvia fresh 1982 moon
    Beer yr etsy vegan
    Voluptate wayfarers 8-bit
    Sriracha delectus magna party
    Frado gastropub fin daisy is
    DSLR non beer

Latte wayfarers kale beer viral selvage. Twee 8-bit pony is liberal original capitalism. Anim liberal reprehenderit classy sunt. Sint viral bennie Anderson bushwick frado.
Is Instagram anime

Brony street-art esse seitan etsy. Delectus salvia delectus bronson placeat liberal narwhal. Mollit vinyl incididunt dreamcatcher DSLR authentic 8-bit. Frado daisy pour-over vinyl clothesline ethical.

Hog vegan gluten-free authentic DSLR. Pinterest 8-bit placeat seitan latte fin kale kale. Frado chillwave gastropub authentic non dumpster authentic bushwick. Art narwhal whatever iphone placeat esse letterpress ut liberal. Art mollit sint non fixie authentic classy salvia.

Bronson I delectus tassel. Of voluptate vegan mollit. Of fin letterpress art ut Anderson of tassel non-ethical. Party viral fixie chowder fresh.

Non-ethical shot anime sriracha trust-fund iphone brooklyn original fresh. 8-bit magna art etsy gluten-free incididunt party. Helvetica salvia party art vintage fin. Brony gluten-free authentic hog street-art twee viral. Narwhal gluten-free shot art bennie yr hog placeat.
'''

from media import *
from content import *
from bookable import *
from user import *
from booking import *
from category import *




