/*global define */
/*global model */
/*global $ */

define(['helpers/cookies', 'lib/jquery'], function (cookieHelper) {
	'use strict';
	var $el = $('body');

	var change = function (newCurrency) {
		$el.trigger('currencyChange', newCurrency);
		cookieHelper.set('currency', newCurrency);
	};

	var onchange = function (callback) {
		$el.on('currencyChange', function (element, cur) {callback(cur); });
	};

	var convert = function (basePrice, currency) {
		currency = currency || model.currency.selected;
		var rate = model.currency.rates[currency];
		return Math.ceil(basePrice / rate.val) * rate.multiplier;
	};

	return {
		'change': change,
		'onchange': onchange,
		'convert': convert
	};
});