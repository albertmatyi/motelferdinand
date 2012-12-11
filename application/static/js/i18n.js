define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
	],
    function(js){
        return {
            /**
             * Populates rendered input fields with data from a given entity.
             * The entity should contain a correctly inited i18n field.
             * The directives should be a dictionary with id-valueKey pairs 
             */
            populateFields: function (entity, directives, $context){
                for (var i = 0; i < model.languages.length; i++) {
                    var lang_id = model.languages[i].lang_id;
                    for (inpId in directives) {
                        var inp=$('#'+inpId+lang_id, $context);
                        console.log(inp);
                        inp.val(entity.i18n[lang_id][directives[inpId]]);
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
                                $el.attr('name', $el.attr('name')+lang_id)
                                $el.attr('id', $el.attr('id')+lang_id)
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
            }
        };
	//close the function & define
	}
);