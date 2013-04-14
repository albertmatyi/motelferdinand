/*global define */
/*global model */

define(['helpers/cookies'], function () {
	'use strict';
	var titleDirective = {
		href : function () {
			return '#Category' + this.id;
		},
		'class' : function () {
			return this.subcategories && this.subcategories.length > 0 ? 'dropdown-toggle'
					: '';
		},
		'data-toggle' : function () {
			return this.subcategories && this.subcategories.length > 0 ? 'dropdown' : '';
		},
		html : function () {
			return this.i18n[model.language].title +
				(this.subcategories && this.subcategories.length > 0 ? '<b class="caret"></b>' : '');
		}
	};
	return {
		title : titleDirective,
		visible : {
			'class' : function () {
				return this.subcategories && this.subcategories.length > 0 ? 'dropdown' : '';
			},
			html : function () {
				return '';
			}
		},
		subcategories : {
			title : titleDirective
		}
	};
});