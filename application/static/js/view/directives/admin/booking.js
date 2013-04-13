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
				'text' : function (params) {
					return '';
				},
				'class' : function (params) {
					return this[fieldName] === "True" ? ' icon-ok-sign' : ' icon-minus-sign';
				}
			};
		},
			dir = {
				'id' : {
					'id' : function (params) {
						$(params.element).data('bookingId', this.id);
						return 'Booking' + this.id;
					},
					'text' : function (params) {
						return '';
					},
					'class' : function (params) {
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
				'booking_entries_summary' : {
					'text' : function (params) {
						var str = '',
							i;
						for (i = this.booking_entries.length - 1; i >= 0; i -= 1) {
							str += ', ' + model.db.bookable[this.booking_entries[i].bookable].i18n[model.language].title;
						}
						return str.substring(2);
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
	}
);