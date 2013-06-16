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

	var convert = function (price, srcCurrency, dstCurrency, rates) {
		if (!srcCurrency) {
			throw 'Currencies not defined';
		}
		dstCurrency = dstCurrency || model.currency.selected;
		rates = rates || model.currency.rates;
		rates = rates || model.currency.rates;
		var rate = rates[srcCurrency];

		var basePrice = price * rate.val / rate.multiplier;
		return convertDefaultTo(basePrice, dstCurrency, rates);
	};

	var convertDefaultTo = function (basePrice, currency, rates) {
		rates = rates || model.currency.rates;
		currency = currency || model.currency.selected;
		var rate = rates[currency];
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

	var initSelect = function ($currencySelect) {
		$currencySelect.empty().append(getCurrencyOptions());
		$currencySelect.off('change').on('change', function () {
			change($(this).val());
		});
	};

	return {
		'change': change,
		'onchange': onchange,
		'convert': convert,
		'convertDefaultTo': convertDefaultTo,
		'isValid': isValid,
		'initSelect': initSelect
	};
});