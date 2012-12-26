define(
	[
        "helpers/form",
        "helpers/wysihtml5"
	],
    function(formHelper, wysihtml5){
        var SEPARATOR = '-';
        var PREFIX = 'i18n-'
        return {
            /**
             * Used for static string translation on the client side. 
             * defs can be found in si18n.translations_js
             */
            translate: function(what, lang_id){
                if(!lang_id){
                    lang_id = model.language;
                }
                if(model.si18n[lang_id] && model.si18n[lang_id][what]){
                    return model.si18n[lang_id][what];
                }
                return 'translations_js.'+lang_id+'.'+what;
             
            },
            /**
             * Populates rendered input fields with data from a given entity.
             * The entity should contain a correctly inited i18n field.
             * The directives should be a dictionary with id-valueKey pairs 
             */
            populateForm: function ($form, entity){
                // populate simple fields
                formHelper.populate($form, entity);

                // populate i18n fields
                for (var i = 0; i < model.languages.length; i++) {
                    var lang_id = model.languages[i].lang_id;
                    if(entity['i18n']){
                        for (field in entity.i18n[lang_id]) {
                            var tmpId = '[name="'+PREFIX+lang_id+SEPARATOR+field+'"]';
                            var inp=$('input'+tmpId + ',select'+tmpId, $form);
                            var value = entity.i18n[lang_id][field];
                            if(inp.length > 0 ){
                                inp.val(value);
                            }else{
                                wysihtml5.setValue($('textarea'+tmpId, $form), value);
                            }
                        }
                    }
                }
            },
            /**
             * Submits a form using the formHelper and 
             * formats collected i18ned data to conform with the original
             * object
             */
            'submitForm' : function ($form, action, successCallback){
                formHelper.submitForm($form, action, function(entity, isNew){
                    var data = $form.serializeArray();
                    if(!entity.i18n){
                        entity.i18n = {};
                    }
                    // update the entity attached to the form 
                    for (var i = data.length - 1; i >= 0; i--) {
                        key = data[i]['name']
                        var keys = key.split('-');
                        if(keys.length == 3 && keys[0] == 'i18n'){
                            if(!entity.i18n[keys[1]]){
                                // eg data.i18n.en
                                entity.i18n[keys[1]] = {};
                            }
                            // set data.i18n.en.title = value
                            var value = data[i]['value'];
                            entity.i18n[keys[1]][keys[2]] = value;
                        }
                    }
                    successCallback && successCallback(entity, isNew);
                });
            },
            /**
             * Multiplies tabs with inputs for i18n support 
             */
            renderLanguageTabs: function($context, TAB_ID_BASE){
                var formTabNavDirectives = {
                    lang_id: {
                        text: function(params){
                            return this.name;
                        },
                        href: function(params){
                            $(params.element).click(function(){
                                $(this).tab('show')
                            });
                            return '#' + TAB_ID_BASE + this.lang_id;
                        }
                    }
                };
                var formTabDirectives = {
                    lang_id: {
                        html: function(params){
                            var lang_id = this.lang_id;
                            $('input, textarea', params.element).each(function(idx, el){
                                var $el = $(el);
                                $el.attr('name', PREFIX+lang_id+SEPARATOR+$el.attr('name'))
                            });
                            return '';
                        },
                        text: function(params){
                            return '';
                        },
                        id: function(params){
                            return TAB_ID_BASE + this.lang_id;
                        }
                    }
                };
                
                $('.nav-tabs', $context).render(model.languages, formTabNavDirectives);
                $('.tab-content', $context).render(model.languages, formTabDirectives);
                $('.nav-tabs a:first', $context).tab('show');
                wysihtml5.renderTextAreas($context);
            }
        };
	//close the function & define
	}
);