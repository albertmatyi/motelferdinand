/*global define */
/*global $ */
/*global model */

define([
	'helpers/tooltip',
	'controllers/booking_datepicker',
	'helpers/currency'
],
	function (tooltip, datepicker, currencyHelper) {
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

		var calcPerNight = function (bookable) {
			var vals = bookable.prices.values;
			var q = parseInt($quantitySelect.val(), 10);
			var g = parseInt($guestsSelect.val(), 10);
			var p = parseInt(bookable.places, 10);
			var price = parseInt(vals[0], 10) * q; // every room should have at least 1 guest
			g = Math.max(0, g - q); // calculate without these guests
			var f = p > 1 ? Math.floor(g / (p - 1)):q; // nr of full rooms
			var rg = p  > 1 ? g % (p - 1):0; // nr of guests that are not in full rooms
			price = price - f * parseInt(vals[0], 10) + f * parseInt(vals[p - 1], 10); // add prices of full rooms
			price = price - parseInt(vals[0], 10) + parseInt(vals[rg], 10); // add price of partially filled room
			return currencyHelper.convert(price);
		};

		var addPriceUpdater = function (bookable) {
			var pcalc = function (currency) {
				if (currency) {
					$currencySelect.val(currency);
				}
				if (!datepicker.isValid()) {
					return;
				}
				var perNight = calcPerNight(bookable);
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
			if ($('option', $currencySelect).length === 0) {
				$currencySelect.html(currencyHelper.getCurrencyOptions());
				$currencySelect.on('change', function () {
					currencyHelper.change($(this).val());
				});
			}
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