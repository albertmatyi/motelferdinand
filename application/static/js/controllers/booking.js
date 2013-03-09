/*global define */
/*global $ */
/*global model */
/*global console */

define(
	[
		'helpers/i18n',
		'helpers/tooltip',
		'controllers/booking_entry',
		'view/alert',
		'view/directives/booking_entry',
		'helpers/transparency'
	],
	function (i18n, tooltip, bookingEntry, alert, entryDirective, transparency) {
		"use strict";

		/**
		 * The jQuery ref to the form to be handled
		 */
		var $form = $('#booking-form');
		/**
		 * The tbody that contains selected rooms
		 */
		var $bookedRooms = $('tbody', $form);

		/**
		 * The input for the username
		 */
		var $userFullName = $('input[name="user.full_name"]', $form);
		/**
		 * The input for the email
		 */
		var $userEmail = $('input[name="user.email"]', $form);
		/**
		 * The input for the email
		 */
		var $userPhone = $('input[name="user.phone"]', $form);
		/**
		 * The button used for submitting a booking
		 */
		var $submitBookingButton = $('#submitBookingButton', $form);
		/**
		 *	The table containing the booked rooms
		 */
		var $bookingsTableControls = $('.tableAddControl', $form);
		/**
		 *
		 */
		var $entryRowTemplate = $('.bookingEntryRowTemplate');

		/**
		 * Does validations, and shows validation messages
		 * @return True if all is ok. False otherwise
		 */
		function validate() {
			var allOk = true;
			var ok = $userFullName.val().match(/[\w -]{3,}/) !== null;
			tooltip.set($userFullName, !ok);
			allOk = allOk && ok;

			ok = $userEmail.val().match(/[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}/) !== null;
			tooltip.set($userEmail, !ok);
			allOk = allOk && ok;

			ok = $userPhone.val().match(/[\d+\s\-]{5,}/) !== null;
			tooltip.set($userPhone, !ok);
			allOk = allOk && ok;

			ok = $bookedRooms.children().length > 0;
			tooltip.set($bookingsTableControls, !ok);
			allOk = allOk && ok;

			tooltip.set($submitBookingButton, !allOk);
			return allOk;
		}

		var stripDomain = function (map) {
			for (var k in map) {
				if (map.hasOwnProperty(k)) {
					var ks=k.split('.');
					if(ks.length > 1){
						map[ks[1]] = map[k];
						delete map[k];
					}
				}
			}
			return map;
		};

		var gatherData = function () {
			var data = {};
			data.user = stripDomain($('input[name*=user]', $form).serializeObject());
			data.bookingEntries = [];
			$('tr').each(function (i, el) {
				var be = stripDomain($(':input', el).serializeObject());
				if (!$.isEmptyObject(be)) {
					data.bookingEntries.push(be);
				}
			});
			return data;
		};

		/**
		 * Do a validation before submitting. If all ok. Submit the form.
		 */
		$submitBookingButton.click(function (ev) {
			var $controlContainer = $form.parent();
			$('.alert-error, .alert-success', $controlContainer).remove();
			// do validation
			// if validation fails, show message
			try {
				if (!validate()) {
					ev.stopImmediatePropagation();
					return false;
				}
				// if all OK send the form
				var booking = gatherData();
				$.ajax({
					type: 'POST',
					url: '/bookings/',
					data: {'data' : JSON.stringify(booking)},
					dataType: 'json',
					success: function (data) {
						// show success message
						var message = alert.alert(data.message, 'success');
						$controlContainer.prepend(message);
						// on response hide the form
						if (data.success) {
							$form.appendTo($('body'));
							// show the original button
							$('.showBookingFormButton', $controlContainer).show().text('Book again');
						}
					},
					error: function (data) {
						var message = alert.alert(JSON.parse(data.responseText).message, 'error');
						$submitBookingButton.before(message);
					}
				});
			} catch (e) {
				console.log(e);
			}

			// block the default behavior
			return false;
		});

		var entryAdded = function (entry) {
			var idx = $bookedRooms.children().length;
			entry.index = idx;

			var $entryRow = transparency.render($entryRowTemplate.clone(), entry, entryDirective);
			$bookedRooms.append($entryRow);
			/**
			 * Upon clicking the remove button remove the row from the bookedRooms table
			 */
			$('.btn-danger', $entryRow).click(function () {
				$entryRow.remove();
			});
		};

		/**
		 * The exposed public method, that adds the booking form to the booking section of the Category
		 * identified by the id
		 */
		var showForm = function (categoryId) {
			var $formCont = $('#Category' + categoryId + ' .booking-controls');
			$('.alert', $formCont).remove();
			$formCont.append($form);

			var bookables = model.db.category[categoryId].bookables;
			$bookedRooms.html('');
			bookingEntry.init(bookables, entryAdded);
		};
		/**
		 * Hide all tooltips when initializing booking entry modal
		 */
		$('#bookingAddRoomModalTrigger', $form).click(function () {
			tooltip.hideAll();
		});

		return {
			'setup' : function (categories) {
				if (typeof (categories) === "undefined") {
					categories = model.categories;
				}
				for (var i = categories.length - 1; i >= 0; i -= 1) {
					var $btn = $('#Category' + categories[i].id + ' .booking-btn');
					$btn.data('categoryId', categories[i].id);
					$btn.click(function () {
						var categoryId = $(this).data('categoryId');
						showForm(categoryId);
						$(this).hide();
						return false;
					});
				}
			},
			'reset' : function () {
				$form.remove();
				$('.booking-btn').show();
			}
		};
	}
);