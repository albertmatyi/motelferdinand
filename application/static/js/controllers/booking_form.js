/*global define */
/*global $ */

define(['helpers/date', 'helpers/tooltip'],
	function (date, tooltip) {
		'use strict';
		var DATE_VALIDATOR = {'isValid' : function ($item) {
			var valid = date.isValid($item.val());
			tooltip.set($item, !valid);
			return valid;
		}};

		var BOOKING_DATE_VALIDATOR = {'isValid' : function ($bookFrom, $bookUntil) {
			if (!DATE_VALIDATOR.isValid($bookFrom) || !DATE_VALIDATOR.isValid($bookUntil)) {
				return false;
			}
			var startD = date.toDate($bookFrom.val());
			var endD = date.toDate($bookUntil.val());
			var valid = startD < endD;
			tooltip.set($bookUntil, !valid);
			var yestd = new Date();
			yestd.setDate(yestd.getDate() - 1);
			var valid2 = yestd < startD;
			tooltip.set($bookFrom, !valid2);
			return valid && valid2;
		}};

		var FORM_ID = 'booking-form';

		/**
		 * The jQuery ref to the form to be handled
		 */
		var $form = $('#' + FORM_ID);

		/**
		 * The input for the username
		 */
		var $userFullName = $('#user\\.full_name', $form);
		/**
		 * The input for the email
		 */
		var $userEmail = $('#user\\.email', $form);
		/**
		 * The input for the email
		 */
		var $userPhone = $('#user\\.phone', $form);

		/**
		 * The button used for submitting a booking
		 */
		var $submitBookingButton = $('#submitBookingButton', $form);

		/**
		 * The select element containing options for quantity
		 */
		var $quantitySelect = $('#booking\\.quantity', $form);
		/**
		 * The select element containing options for guests number
		 */
		var $guestsSelect = $('#booking\\.guests', $form);
		/**
		 * Input that contains the arrival date
		 */
		var $bookFrom = $('#booking\\.book_from', $form);
		/**
		 * Input containing the departure date
		 */
		var $bookUntil = $('#booking\\.book_until', $form);
		/**
		 * The hidden input field containnig the reference to the bokable
		 */
		var $bookableInput = $('#booking\\.bookable', $form);
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

			ok = BOOKING_DATE_VALIDATOR.isValid($bookFrom, $bookUntil);
			allOk = allOk && ok;

			tooltip.set($submitBookingButton, !allOk);
			return allOk;
		}

		var stripDomain = function (map) {
			for (var k in map) {
				if (map.hasOwnProperty(k)) {
					var ks = k.split('.');
					if (ks.length > 1) {
						map[ks[1]] = map[k];
						delete map[k];
					}
				}
			}
			return map;
		};

		var getData = function () {
			var data = {};
			data.user = stripDomain($('input[name*="user."]', $form).serializeObject());
			data.booking = stripDomain($('*[name*="booking."]', $form).serializeObject());
			return data;
		};

		var setDates = function () {
			var d = new Date();
			$bookFrom.val(date.toStr(d));
			d.setDate(d.getDate() + 1);
			$bookUntil.val(date.toStr(d));
		};

		var addGuestsUpdater = function (bookable) {
			$quantitySelect.off('change');
			var f = function () {
				var prevVal = $guestsSelect.val() || 1;
				var qty = $quantitySelect.val();
				var maxGuests = qty * bookable.places;
				addNrOptions($guestsSelect, maxGuests);
				$guestsSelect.val(Math.min(maxGuests, prevVal));
			};
			// add listener
			$quantitySelect.on('change', f);
			// initialize
			f();
		};

		var addNrOptions = function ($el, n) {
			$el.html('');
			for (var j = 1; j <= n; j += 1) {
				$el.append('<option value="' + j + '">' + j + '</option>');
			}
		};

		/**
		 *	Initializes the form for the booking
		 */
		var init = function (bookable) {
			$bookableInput.val(bookable.id);

			addNrOptions($quantitySelect, bookable.quantity);

			addGuestsUpdater(bookable);

			setDates();
		};
		return {
			'init' : init,
			'element' : $form,
			'validate' : validate,
			'getData' : getData,
			'cancelButton' : $('#cancelBookingButton', $form),
			'submitButton' : $submitBookingButton
		};
	}
);