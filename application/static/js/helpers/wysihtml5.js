define([
	'lib/bootstrap-wysihtml5'
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
	        }, 
	        'setValue' : function($textarea, value){
	        	var w5ref = $textarea.data('wysihtml5');
                if(w5ref){
                    w5ref.editor.setValue(value);
                }else{
                    $textarea.html(value);    
                }
	        }
		};	
	}
);