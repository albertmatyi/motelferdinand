/*global define */
/*global $ */

define(['helpers/currency', 'lib/jquery'], function (currencyHelper) {
	'use strict';

	var currencyChanged = function (currency) {
		$('.bookable').each(function () {
			var select = $('.currency', this);
			select.val(currency);
			var val = select.data('price');
			var nuVal = currencyHelper.convertDefaultTo(val, currency);
			$('.price span[data-bind="price"]', this).text(nuVal);
		});
	};

	var init = function ($context) {
		if (!$context) {
			currencyHelper.onchange(currencyChanged);
		}
	};

	return {
		'init': init
	};
});