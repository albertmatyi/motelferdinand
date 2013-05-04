/*global define */
/*global $ */
/*global model */

define([
	'view/directives/admin/user',
	'view/directives/common',
	'helpers/date',
	'helpers/i18n'
], function (userDirective, common, date, i18n) {
	'use strict';
	var getBoolDir = function (fieldName) {
		return {
			'text' : function () {
				return '';
			},
			'class' : function (params) {
				var $el = $(params.element);
				return $el.is('i') ?
					(this[fieldName] === 'True' ? 'icon-ok-sign icon-white' : 'icon-minus-sign icon-white')
					:
					(this[fieldName] === 'True' ? fieldName : '');
			}
		};
	};
	var getDays = function (booking) {
		return (date.toDate(booking.book_until) - date.toDate(booking.book_from)) / date.SECS_IN_DAY;
	};
	var dir = {
		'index' : {
			text : function () {
				return this.index;
			}
		},
		'bookable' : {
			text : function () {
				return model.db.bookable[this.bookable].i18n[model.language].title;
			}
		},
		'messageVisible': {
			'style': function () {
				return !this.message ? 'display: none;':'';
			}
		},
		'accepted' : getBoolDir('accepted'),
		'paid' : getBoolDir('paid'),
		'nrOfNights': {
			'text': function () {
				return getDays(this);
			}
		},
		'pricePerNight': {
			'text': function () {
				return this.price / getDays(this);
			}
		},
		'accepted-button' : {
			'text' : function (params) {
				if (this.accepted === 'True') {
					$(params.element).addClass('disabled');
				} else {
					$(params.element).removeClass('disabled');
				}
				return $(params.element).text();
			}
		},
		'paid-button' : {
			'text' : function () {
				return i18n.translate(this.paid === 'True' ? 'Mark as unpaid' : 'Mark as paid');
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