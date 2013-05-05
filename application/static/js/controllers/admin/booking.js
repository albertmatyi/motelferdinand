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
	var initClass = $bookingsModal.prop('class');
	$bookingsModal.footer = $('.modal-footer', $bookingsModal);
	var $bookingDetails = $('.bookingDetails', $bookingsModal);
	var $bookingTextarea = $('#bookingTextarea', $bookingsModal);
	var $footerButtons = $('.footerButtons', $bookingDetails);
	var $bookingsButton = $('#adminBookingsButton');
	var $table = $('.bookingsList .table > tbody', $bookingsModal);
	var $badge = $('.badge', $bookingsButton);
	var buttonsInitialized = false;

	var render = function () {
		$('.bookingsList .table > tbody', $bookingsModal).render(model.bookings, bookingsDirective);

		$('tr', $table).click(function () {
			showDetails($(this).data('bookingId'));
		});
	};

	var showList = function () {
		$bookingsModal.prop('class', initClass + ' listView');
	};

	var showDetails = function (bookingId) {
		var booking = model.db.booking[bookingId];
		$bookingDetails.data('bookingId', booking.id);
		$bookingDetails.render(booking, bookingDetailsDirective);
		$bookingsModal.prop('class', initClass + ' detailsView');
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

	var acceptBooking = function () {
		var booking = model.db.booking[$bookingDetails.data('bookingId')];
		var mail = { 'mail': $bookingTextarea.val() };
		$.ajax({
			url : 'admin/bookings/accept/' + booking.id,
			success : function (data) {
				booking.accepted = 'True';
				booking.modified = data.modified;
				modal.displayNotification($bookingsModal, data.message, 'success');
				var $row = $('#Booking' + booking.id);
				showDetails(booking.id);
				$row = transparency.render($row, booking, bookingsDirective);
				$bookingDetails.render(booking, bookingDetailsDirective);
				renderBadge();
			},
			'error' : function (data) {
				modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
			},
			type : 'POST',
			data : {'data' : JSON.stringify(mail)},
			dataType: 'json'
		});
	};

	var showAcceptBookingForm = function () {
		if ($(this).hasClass('disabled')) {
			return;
		}
		$bookingsModal.prop('class', initClass + ' acceptBooking');
	};

	var markAsPaid = function () {
		var bk = model.db.booking[$bookingDetails.data('bookingId')];
		var oldVal = bk.paid;
		bk.paid = bk.paid === 'True' ? 'False':'True';
		updateBooking(bk, function (data) {
			modal.displayNotification($bookingsModal, data.message, 'success');
			var $row = $('#Booking' + bk.id);
			$row.render(bk, bookingsDirective);
			$bookingDetails.render(bk, bookingDetailsDirective);
			renderBadge();
		}, function (data) {
			modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
			bk.accepted = oldVal;
		});
	};

	var deleteBooking = function () {
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
				showList();
				render();
				renderBadge();
			},
			'error' : function (data) {
				modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
			}
		});
	};

	var askDeleteBooking = function () {
		dialog.confirm(i18n.translate('Are you sure you wish to delete?'), deleteBooking);
	};

	var initButtons = function () {
		if (!buttonsInitialized) {
			$('#showAcceptBooking', $bookingDetails).click(showAcceptBookingForm);
			$('#acceptBooking', $bookingDetails).click(acceptBooking);
			$('#markAsPaid', $bookingDetails).click(markAsPaid);
			$('#closeBookingDetails', $bookingDetails).click(function () {
				$('#Booking' + $bookingDetails.data('bookingId'), $bookingsModal).show();
				showList();
			});
			$('#deleteBooking', $bookingDetails).click(askDeleteBooking);
			buttonsInitialized = true;
		}
	};


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


	var showBookings = function () {
		$.getJSON('/admin/bookings/',
			function (data) {
				model.mapToDB(data, 'booking');
				model.bookings = data;
				render();
				initButtons();
				showList();
				$bookingsModal.modal('show');
			}
		);
		return this;
	};

	var init = function () {
		$footerButtons.appendTo($bookingsModal.footer);
		return this;
	};

	$bookingsButton.click(showBookings);

	return {
		'showBookings': showBookings,
		'init': init
	};
});