define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "helpers/wysihtml5"
	],
    function(js, w5){
        var SEPARATOR = '-';
        var PREFIX = 'i18n-'
        return {
            /**
             * Populates rendered input fields with data from a given entity.
             * The entity should contain a correctly inited i18n field.
             * The directives should be a dictionary with id-valueKey pairs 
             */
            populateFields: function (entity, $context){
                for (var i = 0; i < model.languages.length; i++) {
                    var lang_id = model.languages[i].lang_id;
                    for (field in entity.i18n[lang_id]) {
                        var tmpId = '[name="'+PREFIX+field+SEPARATOR+lang_id+'"]';
                        var inp=$('input'+tmpId + ',select'+tmpId, $context);
                        var value = entity.i18n[lang_id][field];
                        if(inp.length > 0 ){
                            inp.val(value);
                        }else{
                            inp=$('textarea'+tmpId, $context);
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
                                $el.attr('name', PREFIX+$el.attr('name')+SEPARATOR+lang_id)
                                $el.attr('id', PREFIX+$el.attr('id')+SEPARATOR+lang_id)
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
                w5.renderTextAreas($context);
            }
        };
	//close the function & define
	}
);