define({
	'index' : {
		text : function(params){
			return params.index+1;
		}
	},
	'user.full_name' : {
		text : function(params){
			return this.user.full_name;
		}
	},
	'user.email' : {
		text : function(params){
			return this.user.email;
		}
	},
	'user.phone' : {
		text : function(params){
			return this.user.phone;
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
			return $(params.element).attr('class') + (this.accepted === true ? ' icon-ok':' icon-minus');
		}
	},
	'paid' : {
		text : function(params){
			return '';
		},
		'class' : function(params){
			return $(params.element).attr('class') + (this.paid === true ? ' icon-ok':' icon-minus');
		}
	}
});