/*global define */

define([
	'lib/jquery',
	'lib/datepicker',
	'helpers/date'
], function (jq, dp, date) {
	
	var setupDay = function (date) {
		return {
			'enabled': true,
			'classes': 'enabled',
			'tooltip': 'pick me!'
		};
	};

	var loadBookingDates = function(bookable) {
		$.getJSON('/bookable/bookings/' + bookable.id, function (data) {

		});
	};

	function init($context, bookable) {
		$('.datepicker').datepicker('remove');
		loadBookingDates(bookable, function () {
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
				beforeShowDay: setupDay
			});
		})
	}

	return {
		'init': init
	};
});