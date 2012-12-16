'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models import AbstractModel
import pdb

class LanguageModel(AbstractModel):
    lang_id = db.StringProperty(required=True, default='en')
    name = db.StringProperty(required=True, default='English')

class I18nableModel(AbstractModel):
    i18d_fields={}

    def to_dict(self):
        '''
            Retrieves the translations for a specific model
            and puts it in the dict returned by super.to_dict
        '''
        # retrieve base dict
        hm = super(I18nableModel, self).to_dict()
        hm['i18n'] = {}
        # add i18ns
        for translation in self.translations:
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
            for lang_id, lang_fields in self.i18n.items():
                for field, value in lang_fields.items():
                    # pdb.set_trace()
                    translation = self.translations.filter('lang_id = ', lang_id).filter('field = ', field).get()
                    if translation :
                        translation.value = value
                        translation.put()
                    else :
                        I18n(lang_id=lang_id, field=field, value=value, foreign_entity=self).put()
        return key
        pass

    def delete(self):
        # delete the translations
        for translation in self.translations:
            translation.delete()
        return super(I18nableModel, self).delete()
        pass

    def populate(self, dictionary):
        '''
            uses super.populate + populates the i18n dict for it to be used in #put()
        '''
        super(I18nableModel, self).populate(dictionary)
        # pdb.set_trace()
        setattr(self, 'i18n', {})
        for key, value in dictionary.items():
            if key.startswith('i18n'):
                (_, lang_id, field_name) = key.split('-')
                if lang_id not in self.i18n:
                    self.i18n[lang_id] = {}
                    pass
                self.i18n[lang_id][field_name] = value
            pass
        pass

class I18n(AbstractModel):
	lang_id = db.StringProperty(required=True, default='en')
	field = db.StringProperty(required=True, default='en')
	value = db.TextProperty(required=False, default='en')
	foreign_entity = db.ReferenceProperty(AbstractModel, collection_name='translations')
