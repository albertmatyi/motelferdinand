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
	'helpers/date',
	'elements/progress'
],
function (jq, transp, bookingsDirective, bookingDetailsDirective,
	i18n, transparency, dialog, adminControls, modal, wysihtml5, date, progress) {
	'use strict';

	var $bookingsButton = $('#adminBookingsButton');
	var $badge = $('.badge', $bookingsButton);

	var $bookingsModal = $('#adminBookingsModal');
	$bookingsModal.footer = $('.modal-footer', $bookingsModal);
	$bookingsModal.body = $('.modal-body', $bookingsModal);
	$bookingsModal.title = $('.modal-header h3', $bookingsModal);

	var $table = $('.bookings-list .table > tbody', $bookingsModal);
	var $tableTemplate = $table.clone();

	var $bookingDetails = $('.booking-details', $bookingsModal);

	var $subject = $('#mail-subject', $bookingsModal);
	var $textarea = $('#booking-textarea', $bookingsModal);

	var listenersInitialized = false;

	var renderList = function () {
		var $nt = $tableTemplate.clone();
		$table.replaceWith($nt);
		$table = $nt;
		$table.render(model.bookings, bookingsDirective);
	};

	var activate = function (view) {
		var cls = $bookingsModal.prop('class');
		var regex = /^.*(\s[\w-]+-view).*$/;
		if (cls.match(regex)) {
			$bookingsModal.removeClass(cls.replace(regex, '$1'));
		}
		$bookingsModal.addClass(view + '-view');
	};

	var showList = function () {
		$('span', $bookingsModal.title).remove();
		renderList();
		$table.off('click').on('click', function (event) {
			showDetails($(event.target).parents('.booking-row').data('bookingId'));
		});
		activate('list');
	};

	var showDetails = function (bookingId) {
		if (bookingId) {
			var booking = model.db.booking[bookingId];
			$bookingDetails.data('bookingId', booking.id);
			$bookingDetails.render(booking, bookingDetailsDirective);
			$('.footer-buttons', $bookingsModal.footer).render(booking, bookingDetailsDirective);
			// disable accept on overbooking
		}
		$('span', $bookingsModal.title).remove();
		$bookingsModal.title.prepend('<span>' + $('.panel-title', $bookingDetails).text() + '</span><span class="separator"></span>');
		activate('details');
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

	var showMailBookingFormFor = function (action, fetchMailContent) {
		if ($(this).hasClass('disabled')) {
			return;
		}
		var $cont = $('.booking-' + action, $bookingsModal);
		var title = $('.panel-title', $cont).text();

		$bookingsModal.title.prepend('<span>' + title + '</span><span class="separator"></span>');

		renderMail(action, fetchMailContent);

		activate(action);
	};

	var renderMail = function (action, fetchMailContent) {
		if (fetchMailContent) {
			var booking = model.db.booking[$bookingDetails.data('bookingId')];
			var user = booking.user;
			var bookable = model.db.bookable[booking.bookable];
			progress.show($bookingsModal.body);
			$.getJSON('/props/mail.' + action + '.' + user.language + '.body', function (data) {
				var val = subst({'lang_id': user.language, 'user': user, 'booking': booking, 'bookable': bookable}, data.value);

				progress.hide();

				wysihtml5.setValue($textarea, val);
			});
			$.getJSON('/props/mail.' + action + '.' + user.language + '.subject', function (data) {
				$subject.val(data.value);
			});
		} else {
			wysihtml5.setValue($textarea, '');
			$subject.val('');
		}
	};

	var acceptBooking = function () {
		setStateAndMail('accept');
	};

	var denyBooking = function () {
		setStateAndMail('deny');
	};

	var setStateAndMail = function (action) {
		var mail = { 'body': $textarea.val(), 'subject': $subject.val() };
		setState(action, {'data' : JSON.stringify(mail)});
	};

	var renderRow = function (booking) {
		var $row = $('#Booking' + booking.id);
		$row.replaceWith(
			transparency.render($row.clone(), booking, bookingsDirective)
		);
	};

	var setState = function (action, data) {
		var booking = model.db.booking[$bookingDetails.data('bookingId')];
		$.ajax({
			url : '/admin/bookings/' + action + '/' + booking.id,
			success : function (data) {
				booking.state = parseInt(data.state, 10);
				booking.modified = data.modified;
				modal.displayNotification($bookingsModal, data.message, 'success');
				renderRow(booking);
				showDetails(booking.id);
				$bookingDetails.render(booking, bookingDetailsDirective);
				renderBadge();
			},
			'error' : function (data) {
				handleException(data);
			},
			type : 'POST',
			data : data,
			dataType: 'json'
		});
	};

	var sendMessage = function () {
		var mail = { 'body': $textarea.val(), 'subject': $subject.val() };
		var booking = model.db.booking[$bookingDetails.data('bookingId')];
		$.ajax({
			url : '/admin/user/message/' + booking.user.id,
			success : function (data) {
				modal.displayNotification($bookingsModal, data.message, 'success');
				activate('details');
			},
			'error' : function (data) {
				handleException(data);
			},
			type : 'POST',
			data : {'data' : JSON.stringify(mail)},
			dataType: 'json'
		});
	};

	var markAsPaid = function () {
		var booking = model.db.booking[$bookingDetails.data('bookingId')];
		if (booking.state === 3) {
			setState('paid');
		} else if (booking.state === 4) {
			setState('accept');
		}
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

				var booking = model.db.booking[bookingId];
				delete model.db.booking[bookingId];
				var idx = model.bookings.indexOf(booking);
				model.bookings.splice(idx, 1);

				$bookingDetails.data('bookingId', -1);
				showList();
				renderBadge();
			},
			'error' : function (data) {
				handleException(data);
			}
		});
	};

	var handleException = function (data) {
		try {
			modal.displayNotification($bookingsModal, JSON.parse(data.responseText).message, 'error');
		} catch (e) {
			var rmTag = function (txt, tagName) {
				return txt.replace(new RegExp('<' + tagName + '(.|[\r\n])*<\/' + tagName + '>', 'g'), '');
			};
			var txt = rmTag(rmTag(data.responseText, 'style'), 'title').replace(/<[^>]*>/g, '');
			modal.displayNotification($bookingsModal, txt, 'error');
		}
	};

	var askDeleteBooking = function () {
		dialog.confirm(i18n.translate('Are you sure you wish to delete?'), deleteBooking);
	};

	var initListeners = function () {
		if (!listenersInitialized) {
			$('#show-accept-booking', $bookingsModal).click(function () { showMailBookingFormFor.call(this, 'accept', true); });
			$('#show-deny-booking', $bookingsModal).click(function () { showMailBookingFormFor.call(this, 'deny', true); });
			$('#accept-booking', $bookingsModal).click(acceptBooking);
			$('#deny-booking', $bookingsModal).click(denyBooking);
			$('#mark-as-paid', $bookingsModal).click(markAsPaid);
			$('#show-send-message', $bookingsModal).click(function () { showMailBookingFormFor.call(this, 'send-message', false); });
			$('#send-message-submit', $bookingsModal).click(sendMessage);
			$('#close-booking-details', $bookingsModal).click(function () {
				showList();
			});
			$('#cancel-mail', $bookingsModal).click(function () {
				showDetails();
			});
			$('#delete-booking', $bookingsModal).click(askDeleteBooking);
			wysihtml5.renderTextAreas($bookingsModal);
			listenersInitialized = true;
		}
	};

	var renderBadge = function (new_bookings_nr) {
		new_bookings_nr = new_bookings_nr ||
			_.reduce(model.bookings, function (sum, el) {
				return sum + (el.state === 1 ? 1:0);
			}, 0);
		if (new_bookings_nr === 0) {
			$badge.hide();
		} else {
			$badge.text(new_bookings_nr);
			$badge.show();
		}
	};


	var showBookings = function () {
		$.getJSON('/admin/bookings/',
			function (data) {
				model.mapToDB(data, 'booking');
				model.bookings = data;
				_.each(data, function (el) {
					el.nrOfNights = date.getDateDiff(el.start, el.end);
					el.pricePerNight = el.price / el.nrOfNights;
					el.state = parseInt(el.state, 10);
				});
				initListeners();
				showList();
				$bookingsModal.modal('show');
				renderBadge();
			}
		);
		return this;
	};

	var init = function () {
		$('.footer-buttons', $bookingsModal.body).each(function (i, fbs) {
			var $fbs = $(fbs);
			$fbs.removeClass('footer-buttons');
			var btns = $fbs.children();
			$('.footer-buttons', $bookingsModal.footer).append(btns);
			btns.addClass($fbs.prop('class'));
		});
		renderBadge(model.new_bookings_nr);
		return this;
	};

	$bookingsButton.click(showBookings);

	return {
		'showBookings': showBookings,
		'init': init
	};
});