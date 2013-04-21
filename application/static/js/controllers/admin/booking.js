/*global define */
/*global $ */
/*global _ */
/*global model */

define([
	'lib/jquery',
	'lib/transparency',
	'view/directives/admin/booking',
	'view/directives/admin/bookingDetails',
	'helpers/i18n',
	'helpers/transparency',
	'elements/dialog',
	'elements/admin/controls',
	'elements/modal'
],
function (jq, transp, bookingsDirective, bookingDetailsDirective, i18n, transparency, dialog, adminControls, modal) {
	'use strict';
	var $bookingsModal = $('#adminBookingsModal');
	var $bookingDetails = $('.bookingDetails', $bookingsModal);
	var $bookingsButton = $('#adminBookingsButton');
	var $table = $('.bookings-table > tbody', $bookingsModal);
	var $ftr = $('.bookings-table > tfoot', $bookingsModal);
	var buttonsInitialized = false;

	var render = function () {
		$('.bookings-table > tbody', $bookingsModal).render(model.bookings, bookingsDirective);

		$('tr', $table).click(function () {
			var $row = $(this),
				booking = model.db.booking[$row.data('bookingId')];
			$('#Booking' + $bookingDetails.data('bookingId'), $bookingsModal).show();
			$bookingDetails.hide();
			$bookingDetails.data('bookingId', booking.id);
			$bookingDetails.render(booking, bookingDetailsDirective);
			$row.after($bookingDetails);
			$row.hide();
			$bookingDetails.show();
		});
	};

	var hideDetails = function () {
		$bookingDetails.hide();
		$bookingDetails.appendTo($ftr);
	};

	var updateBooking = function (booking, successFunction, errorFunction) {
		$.ajax({
			url : 'admin/bookings/',
			success : function (data) {
				booking.modified = data.modified;
				if (successFunction) {
					successFunction(data);
				} else {
					modal.displayNotification($bookingsModal, data.message, 'success');
				}
			},
			'error' : function (data) {
				if (errorFunction) {
					errorFunction(data);
				} else {
					modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
				}
			},
			type : 'POST',
			data : {'data' : JSON.stringify(booking)},
			dataType: 'json'
		});
	};

	var initButtons = function () {
		if (!buttonsInitialized) {
			$('#acceptBooking', $bookingDetails).click(function () {
				if ($(this).hasClass('disabled')) {
					return;
				}
				dialog.confirm(
					i18n.translate('Are you sure you wish to accept? Once you accept, you can no more undo it, and the client will be notified.'),
					function () {
						var bk = model.db.booking[$bookingDetails.data('bookingId')];
						var oldVal =  bk.accepted;
						bk.accepted = 'True';
						updateBooking(bk, function (data) {
							modal.displayNotification($bookingsModal, data.message, 'success');
							var $row = $('#Booking' + bk.id);
							$row = transparency.render($row, bk, bookingsDirective);
							$bookingDetails.before($row);
							$bookingDetails.render(bk, bookingDetailsDirective);
							renderBadge();
						}, function (data) {
							modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
							bk.accepted = oldVal;
						});
					}
				);
			});
			$('#markAsPaid', $bookingDetails).click(function () {
				var bk = model.db.booking[$bookingDetails.data('bookingId')];
				var oldVal = bk.paid;
				bk.paid = bk.paid === 'True' ? 'False':'True';
				updateBooking(bk, function (data) {
					modal.displayNotification($bookingsModal, data.message, 'success');
					var $row = $('#Booking' + bk.id);
					$row = transparency.render($row, bk, bookingsDirective);
					$bookingDetails.before($row);
					$bookingDetails.render(bk, bookingDetailsDirective);
					renderBadge();
				}, function (data) {
					modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
					bk.accepted = oldVal;
				});
			});
			$('#closeBookingDetails', $bookingDetails).click(function () {
				$('#Booking' + $bookingDetails.data('bookingId'), $bookingsModal).show();
				hideDetails();
			});
			$('#deleteBooking', $bookingDetails).click(function () {
				dialog.confirm(i18n.translate('Are you sure you wish to delete the booking?'), function () {
					var bookingId = $bookingDetails.data('bookingId');
					$.ajax({
						'type': 'POST',
						'url': '/admin/bookings/' + bookingId,
						'data': '_method=DELETE',
						'dataType': 'json',
						'success': function (data) {
							modal.displayNotification($bookingsModal, data.message, 'success');
							delete model.db.booking[bookingId];
							$bookingDetails.data('bookingId', -1);
							hideDetails();
							render();
							renderBadge();
						},
						'error' : function (data) {
							modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
						}
					});
				});
			});
			buttonsInitialized = true;
		}
	};

	var $badge = $('.badge', $bookingsButton);

	var renderBadge = function () {
		$badge.text(_.reduce(model.bookings, function (sum, el) {
			return [sum[0] + (el.accepted === 'True' ? 0 : 1),
			sum[1] + (el.paid === 'True' ? 0 : 1)];
		}, [0, 0]).join(' | '));
		if ($badge.text() === '0 | 0') {
			$badge.hide();
		} else {
			$badge.show();
		}
	};
	renderBadge();

	$bookingsButton.click(function () {
		$.getJSON('/admin/bookings/',
			function (data) {
				model.mapToDB(data, 'booking');
				model.bookings = data;
				render();
				initButtons();
				$bookingsModal.modal('show');
			});
	});
//close the function & define
});