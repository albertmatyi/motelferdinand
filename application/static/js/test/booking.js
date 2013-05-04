/*global define */
/*global $ */
/*global model */

define(
[
	'lib/jquery',
	'test/category',
	'test/bookable',
	'helpers/date'
], function (jq, categoryTest, bookableTest, dateHelper) {
	'use strict';
	var catInfo = { title: '' };
	var EUR = 'EUR';
	var bkblInfo = {
		title: '',
		places: 3,
		currency: EUR,
		priceFunction: function (i, j) { return j; }
	};
	var bkngInfo = {
		name: 'John Doe',
		email: 'john.doe@mail.com',
		phone: '+0123456789'
	};
	var $form = $('#booking-form');
	var $nameField = $('#user\\.full_name', $form);
	var $emailField = $('#user\\.email', $form);
	var $phoneField = $('#user\\.phone', $form);
	var $quantityField = $('#booking\\.quantity', $form);
	var $guestsField = $('#booking\\.guests', $form);
	var $bookFrom = $('#booking\\.book_from', $form);
	var $bookUntil = $('#booking\\.book_until', $form);
	var $cancelButton = $('#cancelBookingButton', $form);
	var $submitButton = $('#submitBookingButton', $form);
	var $openBookingButton;
	var $bookable;

	var before = function (t) {
		catInfo.title = 'Test Category for Booking' + t.hash();
		bkblInfo.title = 'Test Bookable' + t.hash();
		categoryTest.createCategory(t, catInfo.title, function ($cat) {
			t.l('Got category ' + $cat.selector);
			var $category = $cat;
			bookableTest.createBookable(t, bkblInfo, $category, function ($bkbl) {
				t.l('Got bookable ' + $bkbl.selector);
				$openBookingButton = $('.showBookingFormButton', $cat);
				$bookable = $bkbl;
			});
		});
	};

	var after = function (t) {
		categoryTest.deleteCategory(t, catInfo.title);
	};

	var clickOpenBooking = function (t) {
		t.l('Press Open Booking button').click($openBookingButton);

		t.l('Check form\'s visibility.').assertVisible($form.selector);
	};

	var clickCancelBooking = function (t) {
		t.l('Press cancel').click($cancelButton.selector);

		t.l('Check the form is invisible.').assertInvisible($form.selector);
	};

	var clickSubmit = function (t) {
		t.l('Press submit').click($submitButton.selector);
		t.l('Wait for server response').waitXHR();
		t.l('Check the form is invisible.').assertInvisible($form.selector);
		t.l('Check success message').assertVisible($bookable.selector + ' .alert-success');
	};

	var testFillForm = function (t) {

		clickOpenBooking(t);

		t.l('Fill name').setValue($nameField, bkngInfo.name);

		t.l('Fill email').setValue($emailField, bkngInfo.email);

		t.l('Fill name').setValue($phoneField, bkngInfo.phone);

		checkPricesForInterval(t, 1);

		checkPricesForInterval(t, 7);

		clickCancelBooking(t);
	};

	var checkPricesForInterval = function (t, delta) {
		var d = new Date();
		d.setDate(d.getDate() + Math.floor(100 * Math.random()));
		t.l('Set from date').setValue($bookFrom, dateHelper.toStr(d));
		d.setDate(d.getDate() + delta);
		t.l('Set until date').setValue($bookUntil, dateHelper.toStr(d));
		checkPrices(t, 2, 1, 2, delta);

		checkPrices(t, 2, 2, 2, delta);

		checkPrices(t, 2, 3, 3, delta);
	};

	var checkPrices = function (t, quant, guests, perNight, days) {
		t.l('Fill quantity').setValue($quantityField, quant);
		t.l('Fill guests').setValue($guestsField, guests);
		var cur = ' ' + EUR + model.language;
		t.l('Verify per night price').$('.pricePerNight', function ($el) {
			t.assertEquals(perNight + cur, $el.text());
		}, $form);
		t.l('Verify days').$('.nrOfNights', function ($el) {
			t.assertEquals(days + '', $el.text());
		}, $form);
		t.l('Verify total').$('.priceTotal', function ($el) {
			t.assertEquals(days * perNight + cur, $el.text());
		}, $form);
	};

	var testBooking = function (t) {
		clickOpenBooking(t);

		t.l('Select 2 rooms').setValue($quantityField, 2);

		t.l('Select 3 guests').setValue($guestsField, 3);

		clickSubmit(t);
	};

	return {
		'name' : 'Booking',
		'before' : before,
		'after' : after,
		'tests' : [
			{ 'testFillForm' : testFillForm },
			{ 'testBooking' : testBooking }
		]
	};
});