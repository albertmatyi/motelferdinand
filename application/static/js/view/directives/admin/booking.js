define([
	'view/directives/admin/user',
	'view/directives/common'
], function(user, common){
	var getStatusDir = function(fieldName){
		return {
			'text' : function(params){
				return '';
			},
			'class' : function(params){
				return this[fieldName] === "True" ? ' icon-ok-sign':' icon-minus-sign';
			}
		};
	}


	var dir =  {
		'id' : {
			'id' : function(params) {
				$(params.element).data('bookingId', this.id);
				return 'Booking' + this.id;
			},
			'text' : function(params) {
				return '';
			},
			'class' : function(params){
				var cls = '';
				cls += this.accepted === 'True' ? ' accepted':'';
				cls += this.paid === 'True' ? ' paid':'';
				return cls;
			}
		},
		'index' : {
			'text' : function(params){
				return params.index+1;
			}
		},
		'booking_entries_summary' : {
			'text' : function(params){
				var str = ''
				for (var i = this.booking_entries.length - 1; i >= 0; i--) {
					str += ', '+model.db.bookable[this.booking_entries[i].bookable].i18n[model.language].title;
				};
				return str.substring(2);
			}
		},
		'created' :{
			'text' : function(params){
				return this.created.split(' ')[0];
			}
		},
		'accepted' : getStatusDir('accepted'),
		'paid' : getStatusDir('paid')
	};
	var usrDir = common.prefixDirective(user,'user');
	for (var key in usrDir){
		dir[key] = usrDir[key];
	}
	return dir;
});