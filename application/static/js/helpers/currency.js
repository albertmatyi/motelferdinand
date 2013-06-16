/*global define */
/*global model */
/*global $ */

define(['helpers/cookies', 'lib/jquery'], function (cookieHelper) {
	'use strict';
	var $el = $('body');

	var change = function (newCurrency) {
		model.currency.selected = newCurrency;
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

	var getCurrencyOptions = function () {
		var opts = [];
		var rates = model.currency.rates;
		var selected = model.currency.selected;
		for (var currency in rates) {
			if (rates.hasOwnProperty(currency)) {
				opts.push(
					$('<option/>', {
						value: currency,
						selected: currency === selected,
						text: currency
					})
				);
			}
		}
		return opts;
	};

	var isValid = function (currency) {
		return currency && typeof currency === 'string' && model.currency.rates[currency];
	};

	return {
		'change': change,
		'onchange': onchange,
		'convert': convert,
		'isValid': isValid,
		'getCurrencyOptions': getCurrencyOptions
	};
});