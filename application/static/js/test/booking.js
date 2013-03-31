/*global define */

define(
[
	'test/category',
	'test/bookable',
	'test/elements/bookingEntry',
	'test/elements/bookingEntryRow'
], function (categoryTest, bookableTest, bookingEntryElement, entryRow) {
	"use strict";
	var categoryTitleStr = "Test Category for Booking";
	var bookableTitleStr = "Test Bookable";
	var name = 'John Doe';
	var email = 'john.doe@mail.com';
	var phone = '+0123456789';
	var $form = $('#booking-form');
	var $nameField = $('#user\\.full_name', $form);
	var $emailField = $('#user\\.email', $form);
	var $phoneField = $('#user\\.phone', $form);
	var $bookingEntryAddButton = $('#bookingEntryAddModalTrigger', $form);
	var $cancelButton = $('#cancelBookingButton', $form);
	var $openBookingButton;
	var $bookable;

	var before = function (t) {
		categoryTitleStr += t.hash(); 
		bookableTitleStr += t.hash(); 
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

	var testAddBookingEntry = function (t) {

		clickOpenBooking(t);

		t.l('Click add room').click($bookingEntryAddButton.selector);

		t.l('Check add room modal visibility').assertVisible(bookingEntryElement.selector);

		bookingEntryElement.fillForm(t, bookableTitleStr, 1, '31-02-2015', '20-03-2015').submit(t);

		t.l('Check add room modal hidden').assertInvisible(bookingEntryElement.selector);

		var entry = entryRow(bookableTitleStr);

		t.l('Check entry row').assertPresent(entry.selector);
	};

	var testRemoveBookingEntry = function (t) {
		var entry = entryRow(bookableTitleStr);

		t.l('Click remove entry').click(entry.removeButton);

		t.l('Check line was deleted.').assertNotPresent(entry.selector);
	};

	return {
		'name' : 'Booking',
		'before' : before,
		'after' : after,
		'tests' : [
			{ 'testFillForm' : testFillForm },
			{ 'testAddBookingEntry' : testAddBookingEntry },
			{ 'testRemoveBookingEntry' : testRemoveBookingEntry }
		]
	};
});