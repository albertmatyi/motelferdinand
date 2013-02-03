define([
	'view/directives/admin/user',
	'view/directives/common'
], function(user, common){

	var dir =  {
		'id' : {
			id : function(params) {
				$(params.element).data('bookingId', this.id);
				return 'Booking' + this.id;
			},
			text : function(params) {
				return '';
			}
		},
		'index' : {
			text : function(params){
				return params.index+1;
			}
		},
		'booking_entries_summary' : {
			text : function(params){
				var str = ''
				for (var i = this.booking_entries.length - 1; i >= 0; i--) {
					str += ', '+model.db.bookable[this.booking_entries[i].bookable].i18n[model.language].title;
				};
				return str.substring(2);
			}
		},
		'created' :{
			text : function(params){
				return this.created.split(' ')[0];
			}
		},
		'accepted' : {
			text : function(params){
				return '';
			},
			'class' : function(params){
				return $(params.element).attr('class') + (this.accepted === "True" ? ' icon-ok-sign':' icon-minus-sign');
			}
		},
		'paid' : {
			text : function(params){
				return '';
			},
			'class' : function(params){
				return $(params.element).attr('class') + (this.paid === "True" ? ' icon-ok-sign':' icon-minus-sign');
			}
		}
	};
	var usrDir = common.prefixDirective(user,'user');
	for (var key in usrDir){
		dir[key] = usrDir[key];
	}
	return dir;
});