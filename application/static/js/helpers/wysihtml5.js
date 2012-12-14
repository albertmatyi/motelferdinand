define([
	"/static/lib/wysihtml5/js/advanced_parser_rules.js",
    "/static/lib/wysihtml5/js/wysihtml5-0.3.0.js",
    "/static/lib/wysihtml5/js/bootstrap-wysihtml5.js"
	],function(){
		var toolbarDirective = {
	        id:{
	            id: function (param){ 
	                return 'wysihtml5-toolbar-'+$(this)[0].id;
	            }
	        }
        };
		return {
	        'renderTextAreas' : function ($context) {
	            $('textarea', $context).each(function (idx, el){
		            	var $el = $(el);
						$el.wysihtml5({ parserRules: wysihtml5ParserRules });
					}	
				);
	        }
		};	
	}
);