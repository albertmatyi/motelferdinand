/*global define */
/*global $ */
/*global model */

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
				$guestsSelect.val(Math.min(maxGuests, prevVal)).trigger('change');
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

		var calcPerNight = function (bookable) {
			var vals = bookable.prices[model.language].values;
			var q = parseInt($quantitySelect.val(), 10);
			var g = parseInt($guestsSelect.val(), 10);
			var p = parseInt(bookable.places, 10);
			var price = parseInt(vals[0], 10) * q; // every room should have at least 1 guest
			g = Math.max(0, g - q); // calculate without these guests
			var f = p > 1 ? Math.floor(g / (p - 1)):q; // nr of full rooms
			var rg = p  > 1 ? g % (p - 1):0; // nr of guests that are not in full rooms
			price = price - f * parseInt(vals[0], 10) + f * parseInt(vals[p - 1], 10); // add prices of full rooms
			price = price - parseInt(vals[0], 10) + parseInt(vals[rg], 10); // add price of partially filled room
			return price;
		};

		var getNights = function () {
			var from = date.toDate($bookFrom.val());
			var until = date.toDate($bookUntil.val());
			return new Date(until - from) / (1000 * 60 * 60 * 24);
		};

		var addPriceUpdater = function (bookable) {
			$guestsSelect.off('change');
			$bookFrom.off('change');
			$bookUntil.off('change');
			var pcalc = function () {
				if (!BOOKING_DATE_VALIDATOR.isValid($bookFrom, $bookUntil)) {
					return;
				}
				var perNight = calcPerNight(bookable);
				var nights = getNights();
				var total = nights * perNight;
				var curr = ' ' + bookable.prices[model.language].currency;
				$('.nrOfNights', $form).text(nights);
				$('.pricePerNight', $form).text(perNight + curr);
				$('.priceTotal', $form).text(total + curr);
			};

			$guestsSelect.on('change', pcalc);
			$bookFrom.on('change', pcalc);
			$bookUntil.on('change', pcalc);
		};

		/**
		 *	Initializes the form for the booking
		 */
		var init = function (bookable) {
			$bookableInput.val(bookable.id);

			setDates();

			addNrOptions($quantitySelect, bookable.quantity);

			addPriceUpdater(bookable);

			addGuestsUpdater(bookable);

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