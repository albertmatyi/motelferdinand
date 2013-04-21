/*global define */
/*global $ */
/*global model */
/*global console */
/*global window */

define(
	[
		'helpers/i18n',
		'helpers/tooltip',
		'controllers/booking_form',
		'elements/notification'
	],
	function (i18n, tooltip, bookingForm, notification) {
		'use strict';

		var SHOW_BOOKING_FORM_SEL = '.showBookingFormButton';
		var BOOK_SHOW_TIME = 500;

		var removeForm = function () {
			var $bookable = bookingForm.element.parents('.bookable');
			$('html, body').animate({scrollTop: $bookable.offset().top - 5 * 16 /*5em*/}, BOOK_SHOW_TIME, function () {
				$(SHOW_BOOKING_FORM_SEL, $bookable).show();
				bookingForm.element.appendTo($('body'));
			});
			bookingForm.submitButton.off('click', submitBooking);
			bookingForm.cancelButton.off('click', removeForm);
		};

		/**
		 * Do a validation before submitting. If all ok. Submit the form.
		 */
		var submitBooking = function (ev) {
			var $bookableControls = bookingForm.element.parent();
			notification.remove($bookableControls);
			// do validation
			// if validation fails, show message
			try {
				if (!bookingForm.validate()) {
					ev.stopImmediatePropagation();
					return false;
				}
				// if all OK send the form
				var booking = bookingForm.getData();
				$.ajax({
					type: 'POST',
					url: '/bookings/',
					data: {'data' : JSON.stringify(booking)},
					dataType: 'json',
					success: function (data) {
						// show success message
						var message = notification.createNotification(data.message, 'success');
						$bookableControls.prepend(message);
						// on response hide the form
						if (data.success) {
							removeForm();
							// show the original button
							$(SHOW_BOOKING_FORM_SEL, $bookableControls).text('Book again');
						}
					},
					error: function (data) {
						var message = notification.createNotification(JSON.parse(data.responseText).message, 'error');
						bookingForm.submitButton.before(message);
					}
				});
			} catch (e) {
				if (typeof console !== 'undefined') {
					console.error(e);
				}
			}

			// block the default behavior
			return false;
		};

		/**
		 * The exposed public method, that adds the booking form to the booking section of the Category
		 * identified by the id
		 */
		var showForm = function (bookableId) {
			if (bookingForm.element.is(':visible')) {
				if (bookingForm.element.offset().top < $(window).scrollTop()) {
					var scrollDst = $(window).scrollTop() - bookingForm.element.height();
					$(window).scrollTop(scrollDst);
				}
				var $showBtn = $(SHOW_BOOKING_FORM_SEL, bookingForm.element.parents('.bookable'));
				bookingForm.element.appendTo($('body'));
				$showBtn.show();
			}
			var $formCont = $('#Bookable' + bookableId + ' .booking-controls');
			notification.remove($formCont);
			$formCont.append(bookingForm.element);
			bookingForm.init(model.db.bookable[bookableId]);

			$('html, body').animate({scrollTop: bookingForm.element.offset().top - 7 * 16 /*5em*/}, BOOK_SHOW_TIME);
			bookingForm.submitButton.on('click', submitBooking);
			bookingForm.cancelButton.on('click', removeForm);
		};

		var initBookable = function (bookable) {
			var $btn = $('#Category' + bookable.category +
				' #Bookable' + bookable.id + ' .booking-btn');

			$btn.data('categoryId', bookable.category);
			$btn.data('bookableId', bookable.id);
			$btn.click(function () {
				var bookableId = $(this).data('bookableId');
				showForm(bookableId);
				$(this).hide();
				return false;
			});
		};

		var forEveryBookable = function (callback) {
			var categories = model.categories;
			for (var i = categories.length - 1; i >= 0; i -= 1) {
				var category = categories[i];
				for (var j = category.bookables.length - 1; j >= 0; j -= 1) {
					callback(category.bookables[j]);
				}
			}
		};

		return {
			'setup' : function (bookable) {
				if (typeof bookable === 'undefined') {
					forEveryBookable(initBookable);
				} else {
					initBookable(bookable);
				}
			},
			'reset' : function () {
				bookingForm.element.remove();
				$('.booking-btn').show();
			}
		};
	}
);