/*global define */
/*global $ */
/*global model */

define([
	'view/directives/admin/user',
	'view/directives/common',
	'view/directives/admin/bookingCommons',
	'helpers/date',
	'helpers/currency',
	'helpers/i18n',
	'lib/jquery'
], function (userDirective, common, bookingCommons, date, currencyHelper, i18n) {
	'use strict';

	var clientPriceToAdmin = function (booking, priceKey) {
		return currencyHelper.convert(booking[priceKey], booking.currencyClient, model.currency.selected, booking.rates);
	};

	var dir = {
		'index' : {
			text : function () {
				return this.index;
			}
		},
		'bookable' : {
			text : function () {
				try {
					return model.db.bookable[this.bookable].i18n[model.language].title;
				} catch (e) {
					return this.bookable;
				}
			}
		},
		'messageVisible': {
			'style': function () {
				return !this.message ? 'display: none;':'';
			}
		},
		'state-icon' : {
			'class' : bookingCommons.stateIconClass
		},
		'state': {
			'text': bookingCommons.stateText,
			'class': function () {
				return this.state >= 3 ? 'ok':'';
			}
		},
		'currencyAdmin': {
			'text': function () {
				return model.currency.selected;
			}
		},
		'acceptance-button' : {
			'text' : function (params) {
				$(params.element).prop('disabled', this.state > 1);
			}
		},
		'discount' : {
			'disabled' : function () {
				return this.state > 1 ? 'disabled':'';
			}
		},
		'paid-button' : {
			'text' : function (params) {
				if (this.state < 3) {
					$(params.element).addClass('disabled');
				} else {
					$(params.element).removeClass('disabled');
				}
				$(params.element).prop('disabled', this.state < 3);
				return i18n.translate(this.state === 4 ? 'Mark as unpaid' : 'Mark as paid');
			}
		}
	};
	var usrDir = common.prefixDirective(userDirective, 'user');
	for (var key in usrDir) {
		if (usrDir.hasOwnProperty(key)) {
			dir[key] = usrDir[key];
		}
	}
	return dir;
});