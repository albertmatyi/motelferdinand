/*global define */
/*global $ */

define(
[
	'lib/jquery',
	'test/category',
	'test/bookable'
], function (jq, categoryTest, bookableTest) {
	'use strict';
	var catInfo = { title: '' };
	var bkblInfo = { title: '' };
	var name = 'John Doe';
	var email = 'john.doe@mail.com';
	var phone = '+0123456789';
	var $form = $('#booking-form');
	var $nameField = $('#user\\.full_name', $form);
	var $emailField = $('#user\\.email', $form);
	var $phoneField = $('#user\\.phone', $form);
	var $quantityField = $('#booking\\.quantity', $form);
	var $guestsField = $('#booking\\.guests', $form);
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

		t.l('Fill name').setValue($nameField, name);

		t.l('Fill email').setValue($emailField, email);

		t.l('Fill name').setValue($phoneField, phone);

		clickCancelBooking(t);
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