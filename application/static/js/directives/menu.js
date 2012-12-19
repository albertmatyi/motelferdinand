define(["helpers/cookies"], function(cookies) {
	titleDirective = {
		href : function(params) {
			return '#Category' + this.id;
		},
		'class' : function(params) {
			return this.subcategories && this.subcategories.length > 0 ? 'dropdown-toggle'
					: '';
		},
		'data-toggle' : function(params) {
			return this.subcategories && this.subcategories.length > 0 ? 'dropdown' : '';
		},
		html : function(params) {
			return this.i18n[model.language].title
					+ (this.subcategories && this.subcategories.length > 0 ? '<b class="caret"></b>'
							: '');
		}
	};		
	return {
		'languageDirective': {
			'name' : {
				'text' : function(params){
					var lang_id = this.lang_id;
					$(params.element).click(function (){
						cookies.set('lang_id', lang_id);
						console && console.log && console.log('setting cookie lang_id='+ lang_id);
						window.location = '/';
					});
					return this.name;
				}
			}
		},
		menuDirective : {
			title : titleDirective,
			visible : {
				'class' : function(params) {
					return this.subcategories && this.subcategories.length > 0 ? 'dropdown' : '';
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