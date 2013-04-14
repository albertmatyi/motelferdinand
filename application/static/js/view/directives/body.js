/*global define */

define([
		'view/directives/content',
		'view/directives/bookable',
		'view/directives/common'
	],
	function (contentDirective, bookableDirective, commonDirectives) {
		'use strict';
		return {
			'id' : {
				id : function () {
					return 'Category' + this.id;
				},
				text : function () {
					return '';
				}
			},
			'entityId' : commonDirectives.getEntityDirective('category'),
			'category-title' : commonDirectives.titleDirective,
			'category-description' : commonDirectives.descriptionDirective,
			'contents' : contentDirective,
			'bookables' : bookableDirective,
			'category-booking-id' : {
				'id' : function () {
					return 'bookBtn' + this.id;
				},
				'text' : function (params) {
					return params.element.text;
				}
			}
		};
	}
);