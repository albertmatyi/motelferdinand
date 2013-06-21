/*global define */
/*global model */
/*global $ */
/*global _ */

define(['helpers/currency', 'helpers/date'], function (currencyHelper, dateHelper) {
	'use strict';

	var setAdminPrices = function (el) {
		el.pricePerNightAdmin = currencyHelper.convertDefaultTo(el.pricePerNight, undefined, el.rates);
		el.priceAdmin = el.pricePerNightAdmin * el.nrOfNights;
		el.discountAdmin = currencyHelper.convert(el.discountClient, el.currencyClient);
		el.totalAdmin = el.priceAdmin - el.discountAdmin;
		el.totalPricePerNightAdmin = el.totalAdmin / el.nrOfNights;
	};

	var loadNewBookings = function (callback) {
		$.getJSON('/admin/bookings/', function (data) {
			model.mapToDB(data, 'booking');
			model.bookings = data;
			_.each(data, function (el) {
				el.nrOfNights = dateHelper.getDateDiff(el.start, el.end);
				el.rates = JSON.parse(el.rates);
				el.pricePerNight = el.price / el.nrOfNights;
				el.currencyClient = el.currency;

				el.pricePerNightClient = // rounding is applied on the per night value
					currencyHelper.convertDefaultTo(el.pricePerNight, el.currencyClient, el.rates);
				el.priceClient = el.pricePerNightClient * el.nrOfNights;
				el.discountClient = el.discount;
				el.totalClient = el.priceClient - el.discountClient;
				el.totalPricePerNightClient = el.totalClient / el.nrOfNights;

				setAdminPrices(el);
				el.state = parseInt(el.state, 10);
			});
			callback();
		});
	};

	var recalculateAdminPrices = function () {
		_.each(model.bookings, function (el) {
			setAdminPrices(el);
		});
	};

	var setDiscount = function (el, discount) {
		el.discountClient = discount;
		el.totalClient = el.priceClient - el.discountClient;
		el.totalPricePerNightClient = el.totalClient / el.nrOfNights;
		el.discountAdmin = currencyHelper.convert(el.discountClient, el.currencyClient);
		el.totalAdmin = el.priceAdmin - el.discountAdmin;
		el.totalPricePerNightAdmin = el.totalAdmin / el.nrOfNights;
	};

	return {
		'loadNewBookings': loadNewBookings,
		'recalculateAdminPrices': recalculateAdminPrices,
		'setDiscount': setDiscount
	};
});