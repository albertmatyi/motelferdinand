/*global define */
/*global model */
/*global $ */

define(
[
	'view/directives/admin/user',
	'view/directives/common',
	'view/directives/admin/bookingCommons'
],
function (user, common, bookingCommons) {
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
				'class' : bookingCommons.stateClass
			},
			'index' : {
				'text' : function (params) {
					return params.index + 1;
				}
			},
			'bookable' : {
				'text' : function () {
					try {
						return model.db.bookable[this.bookable].i18n[model.language].title;
					} catch (e) {
						return this.bookable;
					}

				}
			},
			'state-icon' : {
				'class' : bookingCommons.stateIconClass
			},
			'state' : {
				'text': bookingCommons.stateText
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