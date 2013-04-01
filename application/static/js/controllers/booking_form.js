/*global define */
/*global $ */

define(['helpers/date', 'helpers/tooltip'],
	function (date, tooltip) {
		"use strict";
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
		 * The select element containing options for quantity
		 */
		var $quantitySelect = $('#addRoomQuantity', $form);
		/**
		 * Input that contains the arrival date
		 */
		var $bookFrom = $('#book\\.from', $form);
		/**
		 * Input containing the departure date
		 */
		var $bookUntil = $('#booking\\.until', $form);
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
		 *	Initializes the add room modal
		 */
		var init = function (bookable) {
			var qty = bookable.quantity;
			$quantitySelect.html('');
			for (var j = 1; j <= qty; j++) {
				$quantitySelect.append('<option value="' + j + '">' + j + '</option>');
			}

			var d = new Date();

			$bookFrom.val(date.toStr(d));
			d.setDate(d.getDate() + 1);
			$bookUntil.val(date.toStr(d));
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