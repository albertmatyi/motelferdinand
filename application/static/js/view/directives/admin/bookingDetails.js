/*global define */
/*global $ */
/*global model */

define([
	'view/directives/admin/user',
	'view/directives/common',
	'helpers/i18n'
], function (user, common, i18n) {
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
		'accepted' : getBoolDir('accepted'),
		'paid' : getBoolDir('paid'),
		'accepted-button' : {
			'text' : function (params) {
				return $(params.element).text();
			},
			'class' : function () {
				return 'btn btn-primary ' + (this.accepted === 'True' ?  'disabled' : '');
			}
		},
		'paid-button' : {
			'text' : function () {
				return i18n.translate(this.paid === 'True' ? 'Mark as unpaid' : 'Mark as paid');
			},
			'class' : function () {
				return 'btn ' + (this.paid === 'True' ?  'btn-warning' : 'btn-success');
			}
		}
	};
	var usrDir = common.prefixDirective(user, 'user');
	for (var key in usrDir) {
		if (usrDir.hasOwnProperty(key)) {
			dir[key] = usrDir[key];
		}
	}
	return dir;
});