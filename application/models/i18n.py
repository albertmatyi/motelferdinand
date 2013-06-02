'''
Created on Jul 26, 2012

@author: matyas
'''
from google.appengine.ext import db
from application.models.base import AbstractModel
from application.models import prop


class I18nableModel(AbstractModel):
    '''
    Abstract Model that adds i18n functionality to subclasses
    '''

    i18d_fields = {}

    def complete_uninitialized_fields(self, ddct):
        '''
            Initializes i18n fields for which no translations were found
        '''
        for lang_id in prop.languages:
            if lang_id not in ddct['i18n']:
                ddct['i18n'][lang_id] = {}
            for fld_name in self.__class__.i18d_fields:
                if fld_name not in ddct['i18n'][lang_id]:
                    ddct['i18n'][lang_id][fld_name] = ''

    def to_dict(self):
        '''
            Retrieves the translations for a specific model
            and puts it in the dict returned by super.to_dict
        '''
        # retrieve base dict
        ddct = super(I18nableModel, self).to_dict()
        ddct['i18n'] = {}
        # add i18ns
        for translation in self.translations:
            if translation.lang_id not in ddct['i18n']:
                ddct['i18n'][translation.lang_id] = {}
            ddct['i18n'][translation.lang_id][translation.field] = \
                translation.value
        self.complete_uninitialized_fields(ddct)
        # return result
        return ddct

    def put(self):
        '''
            Overrides the default put method, and saves translations also
        '''
        # save translations
        key = super(I18nableModel, self).put()
        if hasattr(self, 'i18n'):
            for lang_id, lang_fields in self.i18n.items():
                for field, value in lang_fields.items():
                    # pdb.set_trace()
                    translation = self.translations \
                        .filter('lang_id = ', lang_id) \
                        .filter('field = ', field).get()
                    if translation:
                        translation.value = value
                        translation.put()
                    else:
                        I18n(lang_id=lang_id,
                             field=field,
                             value=value,
                             foreign_entity=self
                             ).put()
        return key

    def delete(self):
        '''
            Overrides the default delete method and deletes translations
        '''
        # delete the translations
        for translation in self.translations:
            translation.delete()
        return super(I18nableModel, self).delete()

    def populate(self, dictionary):
        '''
            uses super.populate + populates the i18n dict for it
            to be used in #put()
        '''
        super(I18nableModel, self).populate(dictionary)
        # pdb.set_trace()
        setattr(self, 'i18n', dictionary['i18n'])


class I18n(AbstractModel):
    lang_id = db.StringProperty(required=True, default='en')
    field = db.StringProperty(required=True, default='en')
    value = db.TextProperty(required=False, default='en')
    foreign_entity = db.ReferenceProperty(AbstractModel,
                                          collection_name='translations')
