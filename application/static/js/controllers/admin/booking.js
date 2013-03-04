/*global define */
/*global $ */
/*global setTimeout */
/*global model */
/*global confirm */

define([
		'lib/transparency',
		'view/directives/admin/booking',
		'view/directives/admin/bookingDetails',
		'helpers/i18n',
		'helpers/transparency',
		'elements/confirmation',
		'elements/admin/controls',
		'view/admin/modal'
	],
	function (transp, bookingsDirective, bookingDetailsDirective, i18n, transparency, confirmation, adminControls, modal) {
		"use strict";
		var $bookingsModal = $('#adminBookingsModal');
		var $modalHeader = $('.modal-header', $bookingsModal);
		var $bookingDetails = $('.bookingDetails', $bookingsModal);
		var $bookingsButton = $('#adminBookingsButton');
		var $table = $('.bookings-table > tbody', $bookingsModal);
		var $ftr = $('.bookings-table > tfoot', $bookingsModal);
		var buttonsInitialized = false;
		var panelRendered = false;

		var render = function (force) {
			if (panelRendered && !force) {
				return;
			}
			panelRendered = true;
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
						modal.displayAlert($bookingsModal, data.message, 'success');
					}
				},
				'error' : function (data) {
					if (errorFunction) {
						errorFunction(data);
					} else {
						modal.displayAlert($bookingsModal, JSON.parse(data.responseText).message, 'error');
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
					if (confirm(i18n.translate('Are you sure you wish to accept?\n Once you accept, you can no more undo it, and the client will be notified.'))) {
						var bk = model.db.booking[$bookingDetails.data('bookingId')];
						var oldVal =  bk.accepted;
						bk.accepted = "True";
						updateBooking(bk, function (data) {
							modal.displayAlert($bookingsModal, data.message, 'success');
							var $row = $('#Booking' + bk.id);
							$row = transparency.render($row, bk, bookingsDirective);
							$bookingDetails.before($row);
							$bookingDetails.render(bk, bookingDetailsDirective);
							renderBadge();
						}, function (data) {
							modal.displayAlert($bookingsModal, JSON.parse(data.responseText).message, 'error');
							bk.accepted = oldVal;
						});
					}
				});
				$('#markAsPaid', $bookingDetails).click(function () {
					var bk = model.db.booking[$bookingDetails.data('bookingId')];
					var oldVal = bk.paid;
					bk.paid = bk.paid === "True" ? "False":"True";
					updateBooking(bk, function (data) {
						modal.displayAlert($bookingsModal, data.message, 'success');
						var $row = $('#Booking' + bk.id);
						$row = transparency.render($row, bk, bookingsDirective);
						$bookingDetails.before($row);
						$bookingDetails.render(bk, bookingDetailsDirective);
						renderBadge();
					}, function (data) {
						modal.displayAlert($bookingsModal, JSON.parse(data.responseText).message, 'error');
						bk.accepted = oldVal;
					});
				});
				$('#closeBookingDetails', $bookingDetails).click(function () {
					$('#Booking' + $bookingDetails.data('bookingId'), $bookingsModal).show();
					hideDetails();
				});
				$('#deleteBooking', $bookingDetails).click(function () {
					if (confirm(i18n.translate('Are you sure you wish to delete the booking?'))) {
						var bookingId = $bookingDetails.data('bookingId');
						$.ajax({
							'type': 'POST',
							'url': '/admin/bookings/' + bookingId,
							'data': '_method=DELETE',
							'dataType': 'json',
							'success': function (data) {
								modal.displayAlert($bookingsModal, data.message, 'success');
								delete model.db.booking[bookingId];
								$bookingDetails.data('bookingId', -1);
								hideDetails();
								render(true);
								renderBadge();
							},
							'error' : function (data) {
								modal.displayAlert($bookingsModal, JSON.parse(data.responseText).message, 'error');
							}
						});
					}
				});
				buttonsInitialized = true;
			}
		};

		var $badge = $('.badge', $bookingsButton);

		var renderBadge = function () {
			$badge.text(model.bookings.reduce(function (sum, el) {
				return [sum[0] + (el.accepted === "True" ? 0 : 1),
				sum[1] + (el.paid === "True" ? 0 : 1)];
			}, [0, 0]).join(' | '));
			if ($badge.text() === '0 | 0') {
				$badge.hide();
			} else {
				$badge.show();
			}
		};
		renderBadge();

		$bookingsButton.click(function () {
			render(false);
			modal.init($bookingsModal);
			initButtons();
			$bookingsModal.modal('show');
		});
	//close the function & define
	}
);