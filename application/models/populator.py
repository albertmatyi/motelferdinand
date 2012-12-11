from application.models import LanguageModel, CategoryModel, ContentModel, BookableModel
from random import Random

def init_langs():
    for lang in LanguageModel.all():
        lang.delete()

    LanguageModel().put()
    LanguageModel(lang_id="hu", name="Magyar").put()
    LanguageModel(lang_id="ro", name="Romana").put()
    pass

def init_bookables(category_key):
    room_title=['Sleep with  style', 'The Apartment', 'Bed & breakfast']
    room_gallery=['https://picasaweb.google.com/110836571215849032642/FerdinandRoom3', 'https://picasaweb.google.com/110836571215849032642/FerdinandRoom2', 'https://picasaweb.google.com/110836571215849032642/FerdinandRoom1'];
    room_description=['<p>Party tassel brew art organic brony. Of helvetica brooklyn liberal dumpster gastropub anim Carles. Ut magna gluten-free fixie fresh before. Letterpress chillwave non-ethical wes gluten-free ethical. Fresh viraliphone dubstep sriracha twee wayfarers farm-to-table. Bennie art suntincididunt hog.</p><p>Beer frado delectus original sunt delectus.Delectus classy local selvage whatever bushwick. Vegan letterpresswayfarers wayfarers chowder.</p>',
                      '<br>Wes whatever anim trust-fund fin party original vinyl fixie. Polaroid <b>street-art</b> frado chowder Instagram sriracha. Art beer beer whatever dumpster <i>voluptate</i> <i>Pinterest</i>. Sriracha yr original farm-to-table. Brooklyn reprehenderit hog placeat incididunt Carles sriracha.',
                      'Capitalism incididunt shot liberal viral art local beer. Bushwick sint Pinterest latte trust-fund sint. Daisy Pinterest vintage frado Carles delectus.</p><p>&nbsp;</p><ul><li>Ethical 8-bit non brew delectus</li><li>Wayfarers daisy non delectus</li><li>Local dumpster capitalism</li></ul>'
                      ]
    for i in range(0,3):
        bm = BookableModel(visible=True, category=category_key,album_url=room_gallery[i], quantity=i+2)
        bm.i18n = {'en': {'title':room_title[i], 'description': room_description[i]},\
                   'ro': {'title':room_title[i]+'ro', 'description': room_description[i]},\
                   'hu': {'title':room_title[i]+'hu', 'description': room_description[i]}}
        bm.put()
    pass

def init_contents(category_key, idx, addGallery):
    cm = ContentModel(visible=True, category=category_key, order=idx*2)
    galleryHtml='<div class="picaslide" data-picaslide-username="110836571215849032642" data-picaslide-albumid="LeBike">[<img alt="Insert picasa album" src="http://localhost:8080/static/img/picasa_s.png"> gallery comes here]</div>'
    desc = lambda : get_random_text(Random().randint(100, len(fixieText)/2-40)).replace('\n','<br/>') + \
                    (galleryHtml if addGallery else '')
    tit = lambda : get_random_text(Random().randint(10, 15)).replace('\n','');
    cm.i18n = {'en': {'title':tit(), 'description': desc()},\
        'ro':{'title':tit()+'ro', 'description': desc()},\
        'hu':{'title':tit()+'hu', 'description': desc()}}
    cm.put()
    pass

def init_db():
    ''' 
        Deletes existing categories and creates new ones
        with a random number of subcategories that are or are not non-menu-entries
    '''

    init_langs()
        
    for cat in CategoryModel.all():
        # this will cascade on all contents / bookables and their translations
        cat.delete()
        pass
    titles = [#'About', 'Location',
              'Rooms']#, 'Guestbook'] 
              #, 'Restaurants', 'Sightseeing',
    #'Partners', 'Documents', 'About']
    
    catidx = 0
    gallAdded=False;
    for title in titles:
        cm = CategoryModel(order=catidx, visible=True, parent_category=None)
        desc = lambda : get_random_text(Random().randint(100, 300)).replace('\n','<br/>')
        cm.i18n = {'en': {'title':title, 'description': desc()},\
                'ro':{'title':title+'ro', 'description': desc()},\
                'hu':{'title':title+'hu', 'description': desc()}}
        key = cm.put()
        
        # add bookables
        if title is 'Rooms':
            init_bookables(key)

        # add random number of contents
        for i in range(0, Random().randint(2, 5)):
            init_contents(key, i, not gallAdded)            
            gallAdded = True
        catidx += 1
        pass
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