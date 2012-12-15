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
                    for (field in entity.i18n[lang_id]) {
                        var tmpId = '[name="'+PREFIX+lang_id+SEPARATOR+field+'"]';
                        var inp=$('input'+tmpId + ',select'+tmpId, $form);
                        var value = entity.i18n[lang_id][field];
                        if(inp.length > 0 ){
                            inp.val(value);
                        }else{
                            inp=$('textarea'+tmpId, $form);
                            var w5ref = inp.data('wysihtml5');
                            if(w5ref){
                                w5ref.editor.setValue(value);
                            }else{
                                inp.html(value);    
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
            'submitForm' : function ($form, action){
                var data = formHelper.submitForm($form, action);
                data['i18n'] = {};
                for (key in data){
                    var keys = key.split('-');
                    if(keys.length == 3 && keys[0] == 'i18n'){
                        if(!data.i18n[keys[1]]){
                            // eg data.i18n.en
                            data.i18n[keys[1]] = {};
                        }
                        // set data.i18n.en.title = value
                        data.i18n[keys[1]][keys[2]] = data[key];
                        delete data[key];
                    }
                }
                return data;
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
                                $el = $(el);
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