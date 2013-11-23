/*global define */
/*global $ */

define(
[
	'view/directives/common',
	'view/directives/bookable_variant',
	'helpers/currency',
	'lib/jquery'
],
function (commonDirectives, bookableVariantDirective, currencyHelper) {
	'use strict';
	var dir = {
		'id' : {
			id : function () {
				return 'Bookable' + this.id;
			},
			text : function () {
				return '';
			}
		},
		'bookable-title' : commonDirectives.titleDirective,
		'entityId' : commonDirectives.getEntityDirective('bookable'),
		'price' : {
			'text': function () {
				if (!this.prices || !this.prices.values[0]) {
					return 'Please define prices!';
				}
				return currencyHelper.convertDefaultTo(this.prices.values[0]);
			}
		},
		'currency' : {
			'html': function (params) {
				var $el = $(params.element);
				currencyHelper.initSelect($el);
				$el.data('price', this.prices.values[0]);
			}
		},
		'price-for-guests' : {
			'text': function (params) {
				var $el = $(params.element);
				return $el.text().replace(/#NR#/, this.places);
			}
		},
		'bookableVariants': bookableVariantDirective
	};
	return dir;
});