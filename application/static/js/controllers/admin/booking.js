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
	'elements/modal',
	'helpers/wysihtml5',
	'helpers/date'
],
function (jq, transp, bookingsDirective, bookingDetailsDirective, i18n, transparency, dialog, adminControls, modal, wysihtml5, date) {
	'use strict';

	var $bookingsButton = $('#adminBookingsButton');
	var $badge = $('.badge', $bookingsButton);

	var $bookingsModal = $('#adminBookingsModal');
	$bookingsModal.footer = $('.modal-footer', $bookingsModal);
	$bookingsModal.title = $('.modal-header h3', $bookingsModal);

	var $table = $('.bookingsList .table > tbody', $bookingsModal);

	var $bookingDetails = $('.bookingDetails', $bookingsModal);

	var $bookingAccept = $('.bookingAccept', $bookingsModal);

	var $subject = $('#mailSubject', $bookingsModal);
	var $textarea = $('#bookingTextarea', $bookingsModal);

	var $footerButtons = $('.footerButtons', $bookingsModal);

	var buttonsInitialized = false;

	var render = function () {
		$('.bookingsList .table > tbody', $bookingsModal).render(model.bookings, bookingsDirective);

		$('tr', $table).click(function () {
			showDetails($(this).data('bookingId'));
		});
	};

	var activate = function (view) {
		var cls = $bookingsModal.prop('class');
		var regex = /^.*(\s\w+View).*$/;
		if (cls.match(regex)) {
			$bookingsModal.removeClass(cls.replace(regex, '$1'));
		}
		$bookingsModal.addClass(view);
	};

	var showList = function () {
		$('span', $bookingsModal.title).remove();
		activate('listView');
	};

	var showDetails = function (bookingId) {
		if (bookingId) {
			var booking = model.db.booking[bookingId];
			$bookingDetails.data('bookingId', booking.id);
			$bookingDetails.render(booking, bookingDetailsDirective);
		}
		$('span', $bookingsModal.title).remove();
		$bookingsModal.title.prepend('<span>' + $('.panelTitle', $bookingDetails).text() + '</span><span class="separator"></span>');
		activate('detailsView');
	};

	var subst = function (dict, str, prefix) {
		prefix = prefix || '#';
		for (var key in dict) {
			if (dict.hasOwnProperty(key)) {
				var val = dict[key];
				if (typeof val === 'object') {
					str = subst(val, str, prefix + key + '\\.');
				} else {
					var regex = new RegExp(prefix + key + '\\b', 'g');
					str = str.replace(regex, val);
				}
			}
		}
		return str;
	};

	var showAcceptBookingForm = function () {
		if ($(this).hasClass('disabled')) {
			return;
		}
		$bookingsModal.title.prepend('<span>' + $('.panelTitle', $bookingAccept).text() + '</span><span class="separator"></span>');
		var booking = model.db.booking[$bookingDetails.data('bookingId')];
		var user = booking.user;
		var bookable = model.db.bookable[booking.bookable];
		$.getJSON('/props/mail.accept.' + user.language + '.body', function (data) {
			var val = subst({'lang_id': user.language, 'user': user, 'booking': booking, 'bookable': bookable}, data.value);
			wysihtml5.setValue($textarea, val);
		});
		$.getJSON('/props/mail.accept.' + user.language + '.subject', function (data) {
			$subject.val(data.value);
		});
		activate(' acceptView');
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
		var mail = { 'mail': $textarea.val() };
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
				showList();
			});
			$('#cancelAccept', $bookingAccept).click(function () {
				showDetails();
			});
			$('#deleteBooking', $bookingDetails).click(askDeleteBooking);
			wysihtml5.renderTextAreas($bookingsModal);
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
				_.each(data, function (el) {
					el.nrOfNights = date.getDateDiff(el.book_from, el.book_until);
					el.pricePerNight = el.price / el.nrOfNights;
				});
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