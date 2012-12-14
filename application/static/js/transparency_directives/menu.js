define(function() {
	titleDirective = {
		href : function(params) {
			return '#Category' + this.id;
		},
		'class' : function(params) {
			return this.subcategories.length > 0 ? 'dropdown-toggle'
					: '';
		},
		'data-toggle' : function(params) {
			return this.subcategories.length > 0 ? 'dropdown' : '';
		},
		html : function(params) {
			return this.i18n[model.language].title
					+ (this.subcategories.length > 0 ? '<b class="caret"></b>'
							: '');
		}
	};		
	return {
		'languageDirective': {
			'name' : {
				'href' : function(params){
					return '/?lang_id='+this.lang_id;
				}
			}
		},
		menuDirective : {
			title : titleDirective,
			visible : {
				'class' : function(params) {
					return this.subcategories.length > 0 ? 'dropdown' : '';
				},
				html : function(params) {
					return '';
				}
			},
			subcategories : {
				title : titleDirective
			}
		}
	}
});