/*global define */
/*global $ */
/*global _ */
/*global model */

define([
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
	'elements/progress',
	'helpers/currency',
	'helpers/mail',
	'model/booking',
	'lib/jquery'
],
function (transp, bookingsDirective, bookingDetailsDirective,
	i18n, transparency, dialog, adminControls, modal, wysihtml5, dateHelper, progress, currencyHelper, mailHelper, bookingModel) {
	'use strict';

	var $bookingsButton = $('#adminBookingsButton');
	var $badge = $('.badge', $bookingsButton);

	var $bookingsModal = $('#adminBookingsModal');
	$bookingsModal.footer = $('.modal-footer', $bookingsModal);
	$bookingsModal.body = $('.modal-body', $bookingsModal);
	$bookingsModal.header = $('.modal-header', $bookingsModal);
	$bookingsModal.title = $('h3', $bookingsModal.header);

	var $table = $('.bookings-list .table > tbody', $bookingsModal);
	$table.head = $('.bookings-list .table > thead', $bookingsModal);
	var $tableTemplate = $table.clone();

	var $bookingDetails = $('.booking-details', $bookingsModal);
	$bookingDetails.body = $('.booking-details-body', $bookingsModal);
	$bookingDetails.discountInput = $('input[data-bind=discount]', $bookingDetails);
	$bookingDetails.acceptButton = $('#show-accept-booking', $bookingsModal);
	$bookingDetails.denyButton = $('#show-deny-booking', $bookingsModal);
	$bookingDetails.updateButton = $('#update-booking', $bookingsModal);


	var UPDATEABLE_FIELDS = ['discount', 'id'];

	var $subject = $('#mail-subject', $bookingsModal);
	var $textarea = $('#booking-textarea', $bookingsModal);

	var $loadBookingsButton = $('.filters .load-bookings', $bookingsModal);
	var $quickSearchField = $('.filters .quicksearch');

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
		quickSearch();
	};

	var showDetails = function (bookingId) {
		if (bookingId) {
			var booking = model.db.booking[bookingId];
			$bookingDetails.data('bookingId', booking.id);
			$bookingDetails.render(booking, bookingDetailsDirective);
			$('.footer-buttons', $bookingsModal.footer).render(booking, bookingDetailsDirective);
			$bookingDetails.data('bookingDraft', null);
		}
		$('span', $bookingsModal.title).remove();
		$bookingsModal.title.prepend('<span>' + $('.panel-title', $bookingDetails).text() + '</span><span class="separator"></span>');
		activate('details');
	};

	var showMailBookingFormFor = function (action, fetchMailContent) {
		if ($(this).hasClass('disabled')) {
			return;
		}
		var $cont = $('.booking-' + action, $bookingsModal);
		var title = $('.panel-title', $cont).text();

		$bookingsModal.title.prepend('<span>' + title + '</span><span class="separator"></span>');

		if (fetchMailContent) {
			progress.show($bookingsModal.body);
			mailHelper.render(action, getSelectedBooking(), function (subject, body) {
				wysihtml5.setValue($textarea, body);
				$subject.val(subject);
				progress.hide();
			});
		} else {
			wysihtml5.setValue($textarea, '');
			$subject.val('');
		}

		activate(action);
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

	var renderBadge = function (newBookingNr) {
		newBookingNr = newBookingNr ||
			_.reduce(model.bookings, function (sum, el) {
				return sum + (el.state === 1 ? 1:0);
			}, 0);
		if (newBookingNr === 0) {
			$badge.hide();
		} else {
			$badge.text(newBookingNr);
			$badge.show();
		}
	};

	var loadBookings = function (callback) {
		bookingModel.loadBookings(
			$('.filters .start').val(),
			$('.filters .end').val(), function () {
			sort('created', -1);
			$('.sorted-by', $table.head)
				.appendTo('th[data-sort-by=created]', $table.head)
				.addClass('sorted-up');
			showList();
			if (typeof callback === 'function') {
				callback();
			}
			quickSearch();
		});
	};

	var showBookings = function () {
		var todayStr = dateHelper.toStr(dateHelper.today);
		$('.filters .start').val(todayStr);
		$('.filters .end').val('');
		$quickSearchField.val('');
		loadBookings(function () {
			$bookingsModal.modal('show');
			renderBadge();
		});
		return this;
	};

	var refreshDetails = function () {
		if ($bookingDetails.is(':visible')) {
			showDetails($bookingDetails.data('bookingId'));
		}
	};

	var recalculatePrices = function () {
		if (!$bookingsModal.is(':visible')) {
			return;
		}
		bookingModel.recalculateAdminPrices();
		refreshDetails();
	};

	var getSelectedBooking = function () {
		return model.db.booking[$bookingDetails.data('bookingId')];
	};

	var getSelectedBookingDraft = function () {
		var draft = $bookingDetails.data('bookingDraft');
		if (!draft) {
			var dbooking = getSelectedBooking();
			draft = {};
			for (var k in dbooking) {
				if (dbooking.hasOwnProperty(k)) {
					draft[k] = dbooking[k];
				}
			}
			$bookingDetails.data('bookingDraft', draft);
		}
		return draft;
	};

	var updateButtonStatesFor = function (bookingDraft) {
		var changed = false;
		var booking = getSelectedBooking();
		for (var k in booking) {
			if (booking.hasOwnProperty(k) && booking[k] !== bookingDraft[k]) {
				changed = true;
				break;
			}
		}
		$bookingDetails.acceptButton.prop('disabled', changed);
		$bookingDetails.denyButton.prop('disabled', changed);
		$bookingDetails.updateButton.prop('disabled', !changed);
	};

	var handleDiscountChange = function () {
		var bookingDraft = getSelectedBookingDraft();
		var discount = parseFloat($bookingDetails.discountInput.val());
		if (!isNaN(discount)) {
			bookingModel.setDiscount(bookingDraft, discount);
			$('*[data-bind=discountClient]', $bookingDetails.body).val(bookingDraft.discountClient);
			$('*[data-bind=discountAdmin]', $bookingDetails.body).text(bookingDraft.discountAdmin);
			$('*[data-bind=totalClient]', $bookingDetails.body).text(bookingDraft.totalClient);
			$('*[data-bind=totalAdmin]', $bookingDetails.body).text(bookingDraft.totalAdmin);
			$('*[data-bind=totalPricePerNightClient]', $bookingDetails.body).text(bookingDraft.totalPricePerNightClient);
			$('*[data-bind=totalPricePerNightAdmin]', $bookingDetails.body).text(bookingDraft.totalPricePerNightAdmin);
			updateButtonStatesFor(bookingDraft);
		}
	};

	var updateBooking = function () {
		var $progress = modal.displayNotification($bookingsModal, i18n.translate('Saving') + '...');
		var draft = getSelectedBookingDraft();
		var toSend = {};
		for (var k in draft) {
			if (draft.hasOwnProperty(k) && UPDATEABLE_FIELDS.indexOf(k) !== -1) {
				toSend[k] = draft[k];
			}
		}
		$.ajax({
			'url': '/admin/bookings/',
			'data': {data: JSON.stringify(toSend)},
			'success': function () {
				modal.displayNotification($bookingsModal, i18n.translate('Saved'), 'success');
				var booking = getSelectedBooking();
				for (var k in toSend) {
					if (booking.hasOwnProperty(k)) {
						booking[k] = toSend[k];
					}
				}
				$bookingDetails.data('bookingDraft', undefined);
				bookingModel.recalculatePrices(booking);
				updateButtonStatesFor(draft);
				$progress.remove();
			},
			'error': function (e) {
				handleException(e);
				$progress.remove();
			},
			'type': 'POST',
			'dataType': 'json'
		});
	};

	var moveFooterElementsToFooter = function () {
		$('.footer-buttons', $bookingsModal.body).each(function (i, fbs) {
			var $fbs = $(fbs);
			$fbs.removeClass('footer-buttons');
			var btns = $fbs.children();
			$('.footer-buttons', $bookingsModal.footer).append(btns);
			btns.addClass($fbs.prop('class'));
		});
	};

	var moveHeaderElementsToHeader = function () {
		$('.header-controls', $bookingsModal.body).each(function (i, hct) {
			var $hct = $(hct);
			$hct.appendTo($bookingsModal.header);
		});
	};

	var quickSearch = function (event) {
		var val = $quickSearchField.val();
		if (event && event.which === 27) { // esc
			val = '';
		}
		if (val === '') {
			$table.removeClass('filtered');
		} else {
			$table.addClass('filtered');
		}
		val = val.toLowerCase();
		$('tr', $table).each(function (idx, el) {
			var $row = $(el);
			if ($row.text().toLowerCase().indexOf(val) !== -1) {
				$row.removeClass('not-a-match');
			} else {
				$row.addClass('not-a-match');
			}
		});
	};

	var sort = function (by, mult) {
		mult = mult || 1;
		var bies = by.split('.');
		model.bookings.sort(function (a, b) {
			for (var i = 0; i < bies.length; i += 1) {
				a = a[bies[i]];
				b = b[bies[i]];
			}
			if (/\d{2}-\d{2}-\d{4}/.exec(bies[i - 1]) !== null) {
				a = dateHelper.toDate(a);
				b = dateHelper.toDate(b);
			}
			if (typeof a === 'string') {
				a = a.toLowerCase();
				b = b.toLowerCase();
			}
			return mult * (a < b ? -1:(a === b ? 0:1));
		});
	};

	var handleSort = function (event) {
		var sb = $(event.target).data('sort-by');
		if (!sb) {
			return;
		}
		var $currentSort = $('.sorted-by', event.target);
		if ($currentSort.length > 0 && !$currentSort.hasClass('sorted-up')) {
			$currentSort.addClass('sorted-up');
			sort(sb, -1);
		} else {
			$('.sorted-by', $table.head).appendTo(event.target).removeClass('sorted-up');
			sort(sb);
		}
		showList();
		quickSearch();
	};

	var init = function () {
		moveFooterElementsToFooter();
		moveHeaderElementsToHeader();
		renderBadge(model.new_bookings_nr);
		currencyHelper.initSelect($('select.currency', $bookingsModal.header));
		$('a[data-toggle=tooltip]', $bookingsModal.body).tooltip({});
		wysihtml5.renderTextAreas($bookingsModal);
		$quickSearchField.on('keyup', quickSearch);
		$('th', $table.head).on('click', handleSort);

		$bookingDetails.acceptButton.click(function () { showMailBookingFormFor.call(this, 'accept', true); });
		$bookingDetails.denyButton.click(function () { showMailBookingFormFor.call(this, 'deny', true); });
		$bookingDetails.updateButton.on('click', updateBooking);
		$loadBookingsButton.on('click', loadBookings);
		$('#accept-booking', $bookingsModal).click(acceptBooking);
		$('#deny-booking', $bookingsModal).click(denyBooking);
		$('#mark-as-paid', $bookingsModal).click(markAsPaid);
		$('#show-send-message', $bookingsModal).click(function () { showMailBookingFormFor.call(this, 'send-message', false); });
		$('#send-message-submit', $bookingsModal).click(sendMessage);
		$('#close-booking-details', $bookingsModal).click(showList);
		$('#delete-booking', $bookingsModal).click(askDeleteBooking);
		$bookingDetails.discountInput.on('keyup', handleDiscountChange).on('change', handleDiscountChange);
		$('#cancel-mail', $bookingsModal).click(function () {
			showDetails(); // empty call needed
		});
		currencyHelper.onchange(recalculatePrices);
		return this;
	};

	$bookingsButton.click(showBookings);

	return {
		'showBookings': showBookings,
		'init': init
	};
});