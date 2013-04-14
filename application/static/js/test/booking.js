/*global define */
/*global $ */

define(
[
	'lib/jquery',
	'test/category',
	'test/bookable'
], function (jq, categoryTest, bookableTest) {
	'use strict';
	var categoryTitleStr;
	var bookableTitleStr;
	var name = 'John Doe';
	var email = 'john.doe@mail.com';
	var phone = '+0123456789';
	var $form = $('#booking-form');
	var $nameField = $('#user\\.full_name', $form);
	var $emailField = $('#user\\.email', $form);
	var $phoneField = $('#user\\.phone', $form);
	var $cancelButton = $('#cancelBookingButton', $form);
	var $openBookingButton;
	var $bookable;

	var before = function (t) {
		categoryTitleStr = 'Test Category for Booking' + t.hash();
		bookableTitleStr = 'Test Bookable' + t.hash();
		categoryTest.createCategory(t, categoryTitleStr, function ($cat) {
			t.l('Got category ' + $cat.selector);
			var $category = $cat;
			bookableTest.createBookable(t, bookableTitleStr, $category, function ($bkbl) {
				t.l('Got bookable ' + $bkbl.selector);
				$openBookingButton = $('.showBookingFormButton', $cat);
				$bookable = $bkbl;
			});
		});
	};

	var after = function (t) {
		categoryTest.deleteCategory(t, categoryTitleStr);
	};

	var clickOpenBooking = function (t) {
		t.l('Press Open Booking button').click($openBookingButton);

		t.l('Check form\'s visibility.').assertVisible($form.selector);
	};

	var clickCancelBooking = function (t) {
		t.l('Press cancel').click($cancelButton.selector);

		t.l('Check the form is invisible.').assertInvisible($form.selector);
	};

	var testFillForm = function (t) {

		clickOpenBooking(t);

		t.l('Fill name').setValue($nameField, name);

		t.l('Fill email').setValue($emailField, email);

		t.l('Fill name').setValue($phoneField, phone);

		clickCancelBooking(t);
	};

	return {
		'name' : 'Booking',
		'before' : before,
		'after' : after,
		'tests' : [
			{ 'testFillForm' : testFillForm }
		]
	};
});