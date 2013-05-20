/* global define */
/* global $ */
/* global _ */


define([
	'lib/jquery',
	'lib/datepicker',
	'helpers/date',
	'helpers/tooltip',
	'helpers/i18n'
], function (jq, dp, dateHelper, tooltip, i18n) {
	'use strict';
    /**
     * The key - value map of day - booked-quantities
     */
	var bookedDates;
    /**
     * The bookable to calculate availability dates for
     */
	var bookable;
    /**
     * The quantity of required rooms
     */
	var quantity = 1;
	/**
	 * The context the datepickers are in
	 */
	var $context;

	var setQuantity = function (q) {
		quantity = q;
		refresh();
	};

	var beforeShowDay = function (date) {
		if (date < dateHelper.today) {
			return false;
		}
		var available = bookable.quantity - (bookedDates[dateHelper.toStr(date)] || 0);
		var allAvailable = bookable.quantity === available;
		return {
			'enabled': available >= quantity,
			'classes': allAvailable ?
				'available'
				: (available >= quantity ?
					'some-available'
					:'not-available'),
			'tooltip': available + ' ' + i18n.translate('available')
		};
	};

	var loadBookingDates = function (callback) {
		$.getJSON('/bookable/bookings/' + bookable.id, function (data) {
			bookedDates = {};
			_.each(data, function (bkng) {
				var start = dateHelper.toDate(bkng.start).getTime();
				var end = dateHelper.toDate(bkng.end).getTime();
				for (var i = start; i < end; i += dateHelper.MILLIS_IN_DAY) {
					var k = dateHelper.toStr(new Date(i));
					bookedDates[k] = bookedDates[k] ? bookedDates[k] + bkng.quantity:bkng.quantity;
				}
			});
			callback();
		});
	};

	var refresh = function () {
		if (!bookable) {
			return;
		}
		remove();
		render();
	};

	var remove = function () {
		$('.input-daterange', $context).datepicker('remove');
	};

	var render = function () {
		$('.input-daterange', $context).datepicker({
			format: 'dd-mm-yyyy',
			todayHighlight: true,
			todayBtn: false,
			autoclose: true,
			weekStart: 1,
			startDate: new Date(),
			endDate: undefined,
			keyboardNavigation: true,
			forceParse: true,
			beforeShowDay: beforeShowDay
		});
	};

	var init = function ($ctxt, bkbl) {
		bookable = bkbl;
		$context = $ctxt;
		remove();
		loadBookingDates(render);
	};

	var validateQuantitiesInRange = function (start, end) {
		if (!bookable) {
			return false;
		}
		start = start.getTime();
		end = end.getTime();
		for (var i = start; i < end; i += dateHelper.MILLIS_IN_DAY) {
			if (!beforeShowDay(new Date(i)).enabled) {
				return false;
			}
		}
		return true;
	};

	var isValid = function ($bookFrom, $bookUntil) {
		var DATE_VALIDATOR = {'isValid' : function ($item) {
			var valid = dateHelper.isValid($item.val());
			tooltip.set($item, !valid);
			return valid;
		}};

		if (!DATE_VALIDATOR.isValid($bookFrom) || !DATE_VALIDATOR.isValid($bookUntil)) {
			return false;
		}
		var startD = dateHelper.toDate($bookFrom.val());
		var endD = dateHelper.toDate($bookUntil.val());
		var validRange = startD < endD;
		tooltip.set($bookUntil, !validRange);
		var yestd = new Date();
		yestd.setDate(yestd.getDate() - 1);
		var validStart = yestd < startD;
		tooltip.set($bookFrom, !validStart);
		var validQRange = validateQuantitiesInRange(startD, endD);
		tooltip.set($bookFrom, !validQRange);
		return validRange && validStart && validQRange;
	};

	return {
		'init': init,
		'setQuantity': setQuantity,
		'isValid': isValid
	};
});