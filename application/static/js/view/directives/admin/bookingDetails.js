define([
	'view/directives/admin/user',
	'view/directives/common'
], function(user, common){
	var getBoolDir = function(fieldName){
		return {
			'text' : function(params){
				return '';
			},
			'class' : function(params){
				var $el = $(params.element);
				return $el.is('i') ? 
					(this[fieldName]==="True" ? "icon-ok-sign icon-white":"icon-minus-sign icon-white")
					:
					(this[fieldName]==="True" ? fieldName:"");
			}
		};
	};
	var dir = {
		'index' : {
			text : function(params){
				return this.index;
			}
		},
		'booking_entries' : {
			'bookable':{
				text : function(params){
					return model.db.bookable[this.bookable].i18n[model.language].title;
				}
			}
		},
		'accepted' : getBoolDir('accepted'),
		'paid' : getBoolDir('paid')
	};
	var usrDir = common.prefixDirective(user,'user');
	for (var key in usrDir){
		dir[key] = usrDir[key];
	}
	return dir;
});