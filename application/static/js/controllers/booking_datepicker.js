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

	var MESSAGE_END_DATE_VALIDATION = i18n.translate('End date must be greater than start date');
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
	 * The form the datepickers are in
	 */
	var $form;

	/**
	 * Input that contains the arrival date
	 */
	var $bookStart;
	/**
	 * Input containing the departure date
	 */
	var $bookEnd;

	var initialized;

	var setQuantity = function (q) {
		quantity = q;
		refresh();
	};

	var getStartDate = function () {
		return dateHelper.toDate($bookStart.val());
	};

	var getEndDate = function () {
		return dateHelper.toDate($bookEnd.val());
	};

	var beforeShowDay = function (date) {
		date = dateHelper.stripTime(date);
		if (date < dateHelper.today) {
			return {'enabled': false};
		}
		var isEndDatepicker = this.element.prop('id').indexOf('end') !== -1;
		// this.date refers to the date that is about to be selected selection
		var startDate = isEndDatepicker ? getStartDate():dateHelper.stripTime(this.date);
		var endDate =  isEndDatepicker ? dateHelper.stripTime(this.date):getEndDate();
		var inRange = date >= startDate && date <= endDate;
		var ret = null;
		if (isEndDatepicker) {
			date = dateHelper.previousDay(date);
			if (date < startDate) {
				ret = {'enabled': false, 'classes': '', 'tooltip': MESSAGE_END_DATE_VALIDATION};
			}
		}
		ret = ret || getAvailabilityData(date);
		if (inRange) {
			ret.classes += ' in-range';
		}
		return ret;
	};

	var getAvailabilityData = function (date) {
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
			initialized = true;
			callback();
		});
	};

	var refresh = function ($el) {
		if (!initialized) {
			return;
		}
		$el = $el || $('.datepicker', $form);
		remove($el);
		render($el);
	};

	var remove = function ($el) {
		$el = $el || $('.datepicker', $form);
		$el.datepicker('remove');
	};

	var render = function ($el) {
		$el = $el || $('.datepicker', $form);
		$el.datepicker({
			format: 'dd-mm-yyyy',
			todayHighlight: true,
			todayBtn: false,
			autoclose: true,
			weekStart: 1,
			startDate: dateHelper.today,
			endDate: undefined,
			keyboardNavigation: true,
			forceParse: false,
			beforeShowDay: beforeShowDay
		});
	};

	var initDates = function () {
		var d = new Date();
		$bookStart.val(dateHelper.toStr(d));
		d.setDate(d.getDate() + 1);
		$bookEnd.val(dateHelper.toStr(d));
		render();
		$bookEnd.trigger('change');
	};

	var init = function ($frm, bkbl) {
		initialized = false;

		bookable = bkbl;
		$form = $frm;
		$bookStart = $('#booking\\.start', $form);
		$bookEnd = $('#booking\\.end', $form);

		remove();
		loadBookingDates(initDates);
	};

	var validateQuantitiesInRange = function (start, end) {
		if (!initialized) {
			return;
		}
		start = start.getTime();
		end = end.getTime();
		for (var i = start; i < end; i += dateHelper.MILLIS_IN_DAY) {
			if (!getAvailabilityData(new Date(i)).enabled) {
				return false;
			}
		}
		return true;
	};

	var isValid = function () {
		if (!initialized) {
			return true;
		}
		var DATE_VALIDATOR = {'isValid' : function ($item) {
			var valid = dateHelper.isValid($item.val());
			tooltip.set($item, !valid);
			return valid;
		}};

		if (!DATE_VALIDATOR.isValid($bookStart) || !DATE_VALIDATOR.isValid($bookEnd)) {
			return false;
		}
		var startD = getStartDate();
		var endD = getEndDate();
		var validRange = startD < endD;
		tooltip.set($bookEnd, !validRange,
			{'title': MESSAGE_END_DATE_VALIDATION});
		var validStart = dateHelper.yesterday < startD;
		tooltip.set($bookStart, !validStart,
			{'title': i18n.translate('Start date can\'t be in the past.')});
		var validQRange = validateQuantitiesInRange(startD, endD);
		tooltip.set($bookStart, !validQRange,
			{'title': i18n.translate('Range can\'t contain overbooked days')});
		return validRange && validStart && validQRange;
	};

	var getNights = function () {
		var from = getStartDate();
		var until = getEndDate();
		return new Date(until - from) / (1000 * 60 * 60 * 24);
	};

	var onchange = function (callback) {
		$bookStart.off('change');
		$bookEnd.off('change');
		$bookStart.on('change', function () {
			remove($bookEnd);
			var startDate = getStartDate();
			var endDate = getEndDate();
			if (endDate <= startDate) {
				$bookEnd.val(dateHelper.toStr(
					dateHelper.nextDay(startDate)
					)
				);
			}
			render($bookEnd);
			callback();
		});
		$bookEnd.on('change', function () {
			refresh($bookStart);
			callback();
		});
	};


	return {
		'init': init,
		'setQuantity': setQuantity,
		'isValid': isValid,
		'getNights': getNights,
		'onchange': onchange
	};
});