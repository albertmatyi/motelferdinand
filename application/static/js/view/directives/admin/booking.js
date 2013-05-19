/*global define */
/*global model */
/*global $ */

define(
[
	'view/directives/admin/user',
	'view/directives/common',
	'helpers/i18n'
],
function (user, common, i18n) {
	'use strict';
	var dir = {
			'id' : {
				'id' : function (params) {
					$(params.element).data('bookingId', this.id);
					return 'Booking' + this.id;
				},
				'text' : function () {
					return '';
				},
				'class' : function () {
					var cls = '';
					switch (this.state) { 
						case 1: cls += 'new'; break;
						case 2: cls += 'denied'; break;
						case 3: cls += 'accepted'; break;
						case 4: cls += 'paid'; break;
					}
					return cls;
				}
			},
			'index' : {
				'text' : function (params) {
					return params.index + 1;
				}
			},
			'bookable' : {
				'text' : function () {
					return model.db.bookable[this.bookable].i18n[model.language].title;
				}
			},
			'state-icon' : {
				'class' : function () {
					var v = '';
					switch (this.state) { 
						case 1: v += 'icon-asterisk'; break;
						case 2: v += 'icon-ban-circle'; break;
						case 3: 
						case 4: v += 'icon-ok-circle'; break;
					}
					return v;
				}
			},
			'state' : {
				'text': function () {
					switch (this.state) { 
						case 1: return i18n.translate('New');
						case 2: return i18n.translate('Denied');
						case 3: return i18n.translate('Accepted');
						case 4: return i18n.translate('Paid');
					}
				}
			}
		},
		usrDir = common.prefixDirective(user, 'user'),
		key;
	for (key in usrDir) {
		if (usrDir.hasOwnProperty(key)) {
			dir[key] = usrDir[key];
		}
	}
	return dir;
});