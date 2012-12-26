define([
],
function(){
	return { 
		'descriptionDirective' : {
			text : function (params) {
				return '';
			},
			html : function(params) {
				return this.i18n[model.language].description;
			}
		},
		'titleDirective' : {
			text : function (params) {
				return this.i18n[model.language].title;
			}
		},
		'getEntityDirective' : function (type){
			var dir = {
				text : function (params){
					$(params.element).data('entity', this);
					return $(params.element).text();
				}
			};
			dir['data-'+type+'-id'] = function(params){
					return this.id;
				};
			dir['data-'+type+'-idx'] = function(params){
					return params.index;
				};
			return dir;
		}
	};
});