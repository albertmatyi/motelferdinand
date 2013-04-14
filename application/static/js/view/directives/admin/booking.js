/*global define */
/*global model */
/*global $ */

define(
[
	'view/directives/admin/user',
	'view/directives/common'
],
function (user, common) {
	'use strict';
	var getStatusDir = function (fieldName) {
		return {
			'text' : function () {
				return '';
			},
			'class' : function () {
				return this[fieldName] === 'True' ? ' icon-ok-sign' : ' icon-minus-sign';
			}
		};
	},
		dir = {
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
					cls += this.accepted === 'True' ? ' accepted' : '';
					cls += this.paid === 'True' ? ' paid' : '';
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
			'accepted' : getStatusDir('accepted'),
			'paid' : getStatusDir('paid')
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