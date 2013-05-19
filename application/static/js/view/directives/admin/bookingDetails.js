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
		'state-icon' : {
			'class' : function () {
				var v = 'icon-white ';
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
			},
			'class': function () {
				return this.state >= 3 ? 'ok':'';
			}
		},
		'nrOfNights': {
			'text': function () {
				return this.nrOfNights;
			}
		},
		'pricePerNight': {
			'text': function () {
				return this.pricePerNight;
			}
		},
		'acceptance-button' : {
			'text' : function (params) {
				if (this.state > 1) {
					$(params.element).addClass('disabled');
				} else {
					$(params.element).removeClass('disabled');
				}
				$(params.element).prop('disabled', this.state > 1);
				return $(params.element).text();
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