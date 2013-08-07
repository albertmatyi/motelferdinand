/*global define */
/*global $ */
/*global model */
/*global _ */

define([
		'lib/jquery',
		'test/category',
		'test/elements/dialog',
		'helpers/currency',
		'helpers/date'
	],
	function (jquery, categoryTest, dialog, currencyHelper, dateHelper) {
		'use strict';
		var $bookableModal;
		var bkblInfo = {
			'title': '',
			'places': 3,
			'quantity': 4,
			'prices': function (i) { return i + 1; },
			'special': [{
				'start': dateHelper.toStr(dateHelper.nextDay(new Date())),
				'end': dateHelper.toStr(dateHelper.nextDay(new Date(), 2)),
				'repeat': 'week',
				'prices': function (i) { return i + 1; }
			}, {
				'start': dateHelper.toStr(dateHelper.nextDay(new Date(), 2)),
				'end': dateHelper.toStr(dateHelper.nextDay(new Date(), 3)),
				'repeat': 'month',
				'prices': function (i) { return i + 3; }
			}, {
				'start': dateHelper.toStr(dateHelper.nextDay(new Date(), 3)),
				'end': dateHelper.toStr(dateHelper.nextDay(new Date(), 4)),
				'repeat': 'year',
				'prices': function (i) { return i + 6; }
			}]
		};
		var catInfo = {
			title: ''
		};
		var $saveButton;
		var $addSpecialButton;
		var $category;
		var categoryId;

		var before = function (t) {
			bkblInfo.title = 'Bookable Title' + t.hash();
			catInfo.title = 'Test Category for Bookable' + t.hash();
			categoryTest.createCategory(t, catInfo.title, function ($cat) {
				t.l('Got category id ' + $cat.selector);
				initVars(t, $cat);
			});
		};

		var initVars = function (t, $cat) {
			t.l('Initializing vars for bookable.');
			$category = $cat;
			categoryId = /\d+/.exec($cat.attr('id'))[0];
			$bookableModal = $('#bookableEditFormModal');
			$saveButton = $('#submitBookableEditForm', $bookableModal);
			$addSpecialButton = $('.special-prices-add-btn', $bookableModal);
		};

		var after = function (t) {
			if ($category) {
				categoryTest.deleteCategory(t, catInfo.title);
			}
		};

		var testAddBookable = function (t) {
			createBookablePvt(t, bkblInfo, $category);
		};

		var createBookable = function (t, info, $cat, callback) {
			initVars(t, $cat);
			info = $.extend({}, bkblInfo, info);
			createBookablePvt(t, info, $cat);
			if (typeof callback !== 'undefined') {
				t.l('after createBookable method').addFunction(function () {
					callback($('.bookable:contains(' + info.title + ')'));
				});
			}
		};

		var createBookablePvt = function (t, info, $cat) {
			currencyHelper.change(model.currency['default']);
			info = $.extend({}, bkblInfo, info);
			t.l('createBookablePvt');
			var $addDropdown = $('.page-header .dropdown-toggle', $cat);
			var $addButton = $('.page-header .addBookableButton', $cat);
			var catId = /\d+/.exec($cat.attr('id'))[0];

			var modelCount0;
			var modelCount1;

			t.addFunction(function () {
				modelCount0 = _.size(model.db.bookable);
				modelCount1 = _.size(model.db.category[catId].bookables);
			});

			t.l('click add bookable').click($addDropdown).waitAnimation().click($addButton).waitAnimation();

			t.l('verify modal visible').assertVisible($bookableModal);

			t.l('fill form title').setValue($('*[name=i18n-en-title]', $bookableModal), info.title);

			t.l('fill form places').setValue($('*[name=places]', $bookableModal), info.places);

			t.l('fill form quantity').setValue($('*[name=quantity]', $bookableModal), info.quantity);

			var expectedPrice = [];
			var expectedSpecial = [];
			t.l('set prices').addFunction(function () {
				setPrices(t, info, expectedPrice, expectedSpecial);
			});

			t.l('click submit').click($saveButton).waitAnimation();

			t.l('wait for response').waitXHR();

			t.l('verify modal invisible').assertInvisible($bookableModal);

			t.l('verify bookable is present').$('.bookable:contains(' + info.title + ')', function ($bookable) {

				t.l('verify places').assertPresent('.places:contains(' + info.places + ')', $bookable);

				t.l('verify price').assertPresent('.price:contains(' + expectedPrice[0] + ')', $bookable);

				t.l('verify price').assertPresent(
					'.price:contains(' + model.currency.selected + ')', $bookable
					);
				t.l('Test booking form button').click($bookable.selector + ' .showBookingFormButton');

				t.l('Verify form presence').assertVisible($bookable.selector + ' #submitBookingButton');

				t.l('Press cancel').click($bookable.selector + ' #cancelBookingButton');

				t.l('Verify form hidden').assertInvisible($bookable.selector + ' #submitBookingButton');
			});

			t.l('Verify model entries').addFunction(function () {
				t.assertEquals(modelCount0 + 1, _.size(model.db.bookable), 'We should have ' + (modelCount0 + 1) + ' bookables');
				t.assertEquals(modelCount1 + 1, _.size(model.db.category[catId].bookables), 'We should have ' + (modelCount1 + 1) + ' bookables');
			});
		};

		var setPrices = function (t, info, priceToExpect, specialPriceToExpect) {
			var displayedPrice = '';
			var baseSel = $bookableModal.selector + ' .prices tbody tr';
			var $inputs = $(baseSel + ' input[name=prices\\.values]');
			t.assertCount(info.places, $inputs.selector);
			setPriceRow(t, $inputs, info.places, info.prices);
			priceToExpect.push(getPrices(info.prices, 1));

			for (var i = 0; i < info.special.length; i += 1) {
				t.l('add special').click($addSpecialButton);
				setSpecials(t, info.special[i], info.places, specialPriceToExpect);
			}
			return displayedPrice;
		};

		var setSpecials = function (t, special, places, specialPriceToExpect) {
			t.$($bookableModal.selector + ' .special-prices tbody tr:last-child', function ($row) {
				t.l('set special start')
					.setValue($row.selector + ' input[name=prices\\.special\\.start]', special.start);
				t.l('set special end')
					.setValue($row.selector + ' input[name=prices\\.special\\.end]', special.end);
				t.l('set special repeat')
					.setValue($row.selector + ' select[name=prices\\.special\\.repeat]', special.repeat);
				setPriceRow(t, $('input[name=prices\\.values]', $row), places, special.prices);
			});
			specialPriceToExpect.push(getPrices(special.prices, 1));
		};

		var getPrices = function (prices, nr) {
			if (typeof prices === 'function') {
				return prices(nr);
			} else {
				return prices[nr];
			}
		};

		var setPriceRow = function (t, $inputs, places, prices) {
			for (var i = 0; i < places; i += 1) {
				var $pinput = $($inputs[i]);
				t.l('Set price for guest' + (i + 1))
					.setValue($pinput, getPrices(prices, i + 1));
			}
		};

		var testDeleteBookable = function (t) {
			deleteBookable(t, bkblInfo.title);
		};

		var deleteBookable = function (t, title) {
			t.$('.bookable:contains(' + title + ') .admin-controls .delete', function ($delBtn) {
				var modelCount0;
				var modelCount1;

				t.addFunction(function () {
					modelCount0 = _.size(model.db.bookable);
					modelCount1 = _.size(model.db.category[categoryId].bookables);
				});

				var bookableId = $delBtn.data('bookable-id');
				t.l('Deleting Bookable ' + bookableId).click($delBtn);

				t.l('Click OK to confirm delete').waitAnimation().click(dialog.confirmation.ok);

				t.l('wait server response').waitXHR().l('click alert ok').waitAnimation().click(dialog.alert.ok);

				t.l('Verify bookable is no more present').assertNotPresent('#Bookable' + bookableId);

				t.l('Verify model entries').addFunction(function () {
					t.assertEquals(modelCount0 - 1, _.size(model.db.bookable), 'We should have ' + (modelCount0 - 1) + ' bookables');
					t.assertEquals(modelCount1 - 1, _.size(model.db.category[categoryId].bookables), 'We should have ' + (modelCount1 - 1) + ' bookables');
				});
			}, $category);
		};

		var testMultipleBookables = function (t) {
			createBookablePvt(t, {title: bkblInfo.title + '1'}, $category);
			createBookablePvt(t, {title: bkblInfo.title + '2'}, $category);
			deleteBookable(t, bkblInfo.title + '1');

			createBookablePvt(t, {title: bkblInfo.title + '3'}, $category);

			deleteBookable(t, bkblInfo.title + '3');
			deleteBookable(t, bkblInfo.title + '2');
		};

		var testEditBookable = function (t) {
			var $editBtn = $('.bookable:contains(' + bkblInfo.title + ') .admin-controls .edit', $category);
			var editedTitle = bkblInfo.title + '2';
			var count = $('.bookable').length;

			t.l('Press edit button.').click($editBtn).waitAnimation();

			t.l('Modify title.').setValue($('*[name=i18n-en-title]', $bookableModal), editedTitle);

			t.l('Click Save.').click($saveButton).waitAnimation();

			t.l('Wait for server response.').waitXHR();

			t.l('verify bookable is present').assertPresent('.bookable-title:contains(' + editedTitle + ')');

			t.l('Verify same number of cats.').assertCount(count, '.bookable');
		};

		return {
			'name' : 'Bookable',
			'before' : before,
			'after' : after,
			'tests' : [
				{ 'testAddBookable' : testAddBookable },
				{ 'testEditBookable' : testEditBookable },
				{ 'testDeleteBookable' : testDeleteBookable },
				{ 'testMultipleBookables' : testMultipleBookables }
			],
			'createBookable' : createBookable
		};
	}
);