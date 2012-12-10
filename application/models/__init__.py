'''
Created on Jul 24, 2012

@author: matyas
'''
from google.appengine.ext import db
from random import Random

class AbstractModel(db.Model):
    created = db.DateTimeProperty(auto_now_add=True)
    
    def to_dict(self):
        '''
            Converts a Model obj, or a model obj array to a dictionary (array of dic
            tionaries
        '''
        arr = [('id',self.key().id())]
        
        for key in self.properties():
            val = getattr(self, key)
            if val is not None and isinstance(getattr(self.__class__, key), db.ReferenceProperty):
                val = val.key().id()
            arr += [(key, unicode(val))]
        if hasattr(self.__class__, 'dependencies'):
            for dep in self.__class__.dependencies:
                val = [el.to_dict() for el in getattr(self, dep)]
                arr += [(dep, val)]
        return dict(arr) 
        pass
    
    def delete(self):
        '''
            Overrides the default delete behaviour and cascades on all categories
            and images first
            @return super.delete()
        '''
        if hasattr(self.__class__, 'dependencies'):
            for dep in self.__class__.dependencies:
                for obj in getattr(self, dep):
                    obj.delete()
        return super(AbstractModel, self).delete()
        pass
    pass

class I18nableModel(AbstractModel):
    i18d_fields={}

    def to_dict(self):
        # retrieve base dict
        hm = super(I18nableModel, self).to_dict()
        # add i18ns
        for translation in self.translations:
            if 'i18n' not in hm:
                hm['i18n'] = {}
            if translation.lang_id not in hm['i18n']:
                hm['i18n'][translation.lang_id] = {}
            hm['i18n'][translation.lang_id][translation.field] = translation.value
        # return result
        return hm
        pass
    pass

    def put(self):
        # save translations
        key = super(I18nableModel, self).put()
        if hasattr(self, 'i18n'):
            for (lang_id, lang_fields) in self.i18n:
                for (field, value) in lang_fields:
                    I18n(lang_id=lang_id, field=field, value=value, foreign_entity=self).put()
        return key
        pass

    def delete(self):
        # delete the translations
        for translation in self.translations:
            translation.delete()
        return super(I18nableModel, self).delete()
        pass

def init_db():
    ''' 
        Deletes existing categories and creates new ones
        with a random number of subcategories that are or are not non-menu-entries
    '''

    for lang in LanguageModel.all():
        lang.delete()

    LanguageModel().put()
    LanguageModel(lang_id="hu", name="Magyar").put()
    LanguageModel(lang_id="ro", name="Romana").put()
        
    for cat in CategoryModel.all():
        cat.delete()
        pass
    titles = [#'About', 'Location',
              'Rooms']#, 'Guestbook']#, 'Restaurants', 'Sightseeing',
    #'Partners', 'Documents', 'About']
    room_title=['Sleep with  style', 'The Apartment', 'Bed & breakfast']
    room_gallery=['https://picasaweb.google.com/110836571215849032642/FerdinandRoom3', 'https://picasaweb.google.com/110836571215849032642/FerdinandRoom2', 'https://picasaweb.google.com/110836571215849032642/FerdinandRoom1'];
    room_description=['<p>Party tassel brew art organic brony. Of helvetica brooklyn liberal dumpster gastropub anim Carles. Ut magna gluten-free fixie fresh before. Letterpress chillwave non-ethical wes gluten-free ethical. Fresh viraliphone dubstep sriracha twee wayfarers farm-to-table. Bennie art suntincididunt hog.</p><p>Beer frado delectus original sunt delectus.Delectus classy local selvage whatever bushwick. Vegan letterpresswayfarers wayfarers chowder.</p>',
                      '<br>Wes whatever anim trust-fund fin party original vinyl fixie. Polaroid <b>street-art</b> frado chowder Instagram sriracha. Art beer beer whatever dumpster <i>voluptate</i> <i>Pinterest</i>. Sriracha yr original farm-to-table. Brooklyn reprehenderit hog placeat incididunt Carles sriracha.',
                      'Capitalism incididunt shot liberal viral art local beer. Bushwick sint Pinterest latte trust-fund sint. Daisy Pinterest vintage frado Carles delectus.</p><p>&nbsp;</p><ul><li>Ethical 8-bit non brew delectus</li><li>Wayfarers daisy non delectus</li><li>Local dumpster capitalism</li></ul>'
                      ]
    galleryHtml='<div class="picaslide" data-picaslide-username="110836571215849032642" data-picaslide-albumid="LeBike">[<img alt="Insert picasa album" src="http://localhost:8080/static/img/picasa_s.png"> gallery comes here]</div>'
    cc = 0
    gallAdded=False;
    for title in titles:
        cm = CategoryModel(order=cc, visible=True, title=title, parent_category=None,description=get_random_text(Random().randint(100, 300)).replace('\n','<br/>'))
        key = cm.put()
        add_translations(cm)
        cc += 1
        if title is 'Rooms':
            for i in range(0,3):
                bm = BookableModel(visible=True, title=room_title[i], category=key, description=room_description[i],album_url=room_gallery[i], quantity=i+2).put()
        # add random number of subcategories
        for i in range(0, Random().randint(2, 5)):
            cm = ContentModel(visible=True, title=get_random_text(Random().randint(10, 15)).replace('\n',''), \
                         category=key,description=get_random_text(Random().randint(100, len(fixieText)/2-40)).replace('\n','<br/>')+(galleryHtml if not gallAdded else ''),\
                         order=i*2)
            cm.put()
            # add_translations(cm)
            gallAdded = True
    pass

def add_translations(entity):
    for lang in LanguageModel.all():
        for field_name in entity.__class__.i18d_fields:
            I18n(field=field_name, value=lang.name +' '+ field_name, lang_id=lang.lang_id, foreign_entity=entity).put()
    pass

def get_random_text(length):
    if length > len(fixieText):
        return fixieText.strip()
    start = Random().randint(20, len(fixieText) - length)
    start = fixieText.find(' ', start - 20) + 1
    return fixieText[start : start + length].capitalize().strip()
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

from language import *
from category import *
from media import *
from content import *
from bookable import *
from user import *
from booking import *





