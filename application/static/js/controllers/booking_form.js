/*global define */
/*global $ */
/*global model */

define([
	'helpers/tooltip',
	'controllers/booking_datepicker',
	'helpers/currency',
	'helpers/price'
],
	function (tooltip, datepicker, currencyHelper, priceHelper) {
		'use strict';

		var FORM_ID = 'booking-form';

		/**
		 * The jQuery ref to the form to be handled
		 */
		var $form = $('#' + FORM_ID);

		var $currencySelect = $('.priceTotal .currency', $form);

		/**
		 * The input for the username
		 */
		var $userFullName = $('#user\\.full_name', $form);
		/**
		 * The input for the email
		 */
		var $userEmail = $('#user\\.email', $form);
		/**
		 * The input for the phone number
		 */
		var $userPhone = $('#user\\.phone', $form);

		var $userCitizenship = $('#user\\.citizenship', $form);

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

			ok = $userEmail.val().match(/^[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}$/) !== null;
			tooltip.set($userEmail, !ok);
			allOk = allOk && ok;

			ok = $userPhone.val().match(/^[\d+\s\-]{5,}$/) !== null;
			tooltip.set($userPhone, !ok);
			allOk = allOk && ok;

			ok = $userCitizenship.val().match(/^[\w\s]{2,}$/) !== null;
			tooltip.set($userCitizenship, !ok);
			allOk = allOk && ok;

			ok = datepicker.isValid();
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

		var addNrOptions = function ($el, n) {
			$el.html('');
			for (var j = 1; j <= n; j += 1) {
				$el.append('<option value="' + j + '">' + j + '</option>');
			}
		};

		var addPriceUpdater = function (bookable) {
			var pcalc = function (currency) {
				if (currencyHelper.isValid(currency)) {
					$currencySelect.val(currency);
				}
				if (!datepicker.isValid()) {
					return;
				}
				var quantity = parseInt($quantitySelect.val(), 10);
				var guests = parseInt($guestsSelect.val(), 10);
				var perNight = priceHelper.calcPerNight(
					bookable.prices, parseInt(quantity, 10), parseInt(guests, 10),
					parseInt(bookable.places, 10),
					datepicker.getStart(), datepicker.getEnd());
				var nights = datepicker.getNights();
				var total = nights * perNight;
				var curr = ' ' + model.currency.selected;
				$('.nrOfNights', $form).text(nights);
				$('.pricePerNight', $form).text(perNight + curr);
				$('.priceTotal .value', $form).text(total);
			};

			$guestsSelect.on('change', pcalc);
			datepicker.onchange(pcalc);
			currencyHelper.onchange(pcalc);
			pcalc();
		};

		var addGuestsUpdater = function (bookable) {

			var f = function () {
				var prevVal = $guestsSelect.val() || 1;
				var qty = $quantitySelect.val();

				datepicker.setQuantity(qty);

				var maxGuests = qty * bookable.places;
				addNrOptions($guestsSelect, maxGuests);
				$guestsSelect.val(Math.min(maxGuests, prevVal)).trigger('change');
			};
			// add listener
			$quantitySelect.on('change', f);
			// initialize
			f();
		};

		var resetListeners = function () {
			$guestsSelect.off('change');
			$quantitySelect.off('change');
		};

		var renderCurrencies = function () {
			currencyHelper.initSelect($currencySelect);
		};

		/**
		 *	Initializes the form for the booking
		 */
		var init = function (bookable) {
			$bookableInput.val(bookable.id);

			renderCurrencies();

			addNrOptions($quantitySelect, bookable.quantity);

			datepicker.init($form, bookable);

			resetListeners();

			addGuestsUpdater(bookable);

			addPriceUpdater(bookable);
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