/*global define */

define(
[
	'test/category',
	'test/bookable'
], function (categoryTest, bookableTest) {
	"use strict";
	var categoryTitleStr = "testCategoryForBooking";
	var bookableTitleStr = "testBookable";
	var $bookable;

	var before = function (t) {
		categoryTest.createCategory(t, categoryTitleStr, function ($cat) {
			t.l('Got category ' + $cat.selector);
			var $category = $cat;
			bookableTest.createBookable(t, bookableTitleStr, $category, function ($bkbl) {
				t.l('Got bookable ' + $bkbl.selector);
				$bookable = $bkbl;
			});
		});
	};
	var after = function (t) {
		categoryTest.deleteCategory(t, categoryTitleStr);
	};
	var testBooking = function (t) {

	};
	return {
		'name' : 'Booking',
		'before' : before,
		'after' : after,
		'tests' : [
			{ 'testBooking' : testBooking }
		]
	};
});