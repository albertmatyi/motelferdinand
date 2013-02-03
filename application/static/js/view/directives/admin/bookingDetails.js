define([
	'view/directives/admin/user',
	'view/directives/common',
	'helpers/i18n'
], function(user, common, i18n){
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
		'paid' : getBoolDir('paid'),
		'accepted-button' : {
			'text' : function(params){
				return $(params.element).text();
			},
			'class' : function(params){
				return 'btn btn-primary ' + (this.accepted === 'True' ?  'disabled':'');
			}
		},
		'paid-button' : {
			'text' : function(params){
				return i18n.translate(this.paid === 'True' ? 'Mark as unpaid':'Mark as paid');
			},
			'class' : function(params){
				return 'btn ' + (this.paid === 'True' ?  'btn-warning':'btn-success');
			}
		}
	};
	var usrDir = common.prefixDirective(user,'user');
	for (var key in usrDir){
		dir[key] = usrDir[key];
	}
	return dir;
});