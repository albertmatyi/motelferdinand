/*global define */
/*global $ */

define(['helpers/currency', 'lib/jquery'], function (currencyHelper) {
	'use strict';

	var changeCurrency = function () {
		currencyHelper.change($(this).val());
	};

	var currencyChanged = function (currency) {
		$('.bookable').each(function () {
			var select = $('.currency', this);
			select.val(currency);
			var val = select.data('price');
			var nuVal = currencyHelper.convert(val, currency);
			$('.price span[data-bind="price"]', this).text(nuVal);
		});
	};

	var init = function ($context) {
		var baseSelector = $context ? '':'.bookable';
		$(baseSelector + ' .price select.currency').on('change', changeCurrency);
		if (!$context) {
			currencyHelper.onchange(currencyChanged);
		}
	};

	return {
		'init': init
	};
});