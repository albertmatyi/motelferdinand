/*global define */
/*global model */

define(["helpers/cookies"], function () {
	'use strict';
	var titleDirective = {
		href : function (params) {
			return '#Category' + this.id;
		},
		'class' : function (params) {
			return this.subcategories && this.subcategories.length > 0 ? 'dropdown-toggle'
					: '';
		},
		'data-toggle' : function (params) {
			return this.subcategories && this.subcategories.length > 0 ? 'dropdown' : '';
		},
		html : function (params) {
			return this.i18n[model.language].title +
				(this.subcategories && this.subcategories.length > 0 ? '<b class="caret"></b>' : '');
		}
	};
	return {
		title : titleDirective,
		visible : {
			'class' : function (params) {
				return this.subcategories && this.subcategories.length > 0 ? 'dropdown' : '';
			},
			html : function (params) {
				return '';
			}
		},
		subcategories : {
			title : titleDirective
		}
	};
});