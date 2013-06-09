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
	var CUR = model.currency.selected;
	var bkblInfo = {
		title: '',
		places: 3,
		priceFunction: function (i) { return i; }
	};
	var bkngInfo = {
		name: 'John Doe',
		citizenship: 'Estonian',
		email: 'john.doe@mail.com',
		phone: '+0123456789'
	};
	var $form = $('#booking-form');
	var $nameField = $('#user\\.full_name', $form);
	var $emailField = $('#user\\.email', $form);
	var $phoneField = $('#user\\.phone', $form);
	var $citizenshipField = $('#user\\.citizenship', $form);
	var $quantityField = $('#booking\\.quantity', $form);
	var $guestsField = $('#booking\\.guests', $form);
	var $bookingStart = $('#booking\\.start', $form);
	var $bookingEnd = $('#booking\\.end', $form);
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
				$openBookingButton = $('.showBookingFormButton', $bkbl);
				$bookable = $bkbl;
			});
		});
	};

	var after = function (t) {
		categoryTest.deleteCategory(t, catInfo.title);
	};

	var clickOpenBooking = function (t) {
		t.l('Press Open Booking button').click($openBookingButton).waitXHR();

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

		t.l('Fill phone').setValue($phoneField, bkngInfo.phone);

		t.l('Fill citizenship').setValue($citizenshipField, bkngInfo.citizenship);

		checkPricesForInterval(t, 1);

		checkPricesForInterval(t, 7);

		clickCancelBooking(t);
	};

	var checkPricesForInterval = function (t, delta) {
		var startDate = new Date();
		startDate.setDate(startDate.getDate() + Math.floor(100 * Math.random()));
		t.l('Set from date').setValue($bookingStart.selector, dateHelper.toStr(startDate));
		t.l('Verify start date').$($bookingStart.selector, function (el) {
			t.assertEquals(dateHelper.toStr(startDate), el.val());
		});
		var endDate = new Date(startDate.getTime());
		endDate.setDate(endDate.getDate() + delta);
		t.l('Set until date').setValue($bookingEnd.selector, dateHelper.toStr(endDate));
		t.l('Verify end date').$($bookingEnd.selector, function (el) {
			t.assertEquals(dateHelper.toStr(endDate), el.val());
		});
		checkPrices(t, 2, 1, 2, delta);

		checkPrices(t, 2, 2, 2, delta);

		checkPrices(t, 2, 3, 3, delta);
	};

	var checkPrices = function (t, quant, guests, perNight, days) {
		t.l('Fill quantity').setValue($quantityField, quant);
		t.l('Fill guests').setValue($guestsField, guests);
		var cur = ' ' + CUR;
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