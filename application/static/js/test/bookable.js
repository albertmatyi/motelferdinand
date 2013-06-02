/*global define */
/*global $ */
/*global model */
/*global _ */

define([
		'lib/jquery',
		'test/category',
		'test/elements/dialog'
	],
	function (jquery, categoryTest, dialog) {
		'use strict';
		var $bookableModal;
		var bkblInfo = {
			title: '',
			places: 3,
			quantity: 4,
			priceFunction: function (i, j, places) { return places * i + j; }
		};
		var catInfo = {
			title: ''
		};
		var $saveButton;
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
			t.l('set prices').addFunction(function () {
				setPrices(t, info, expectedPrice);
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

		var setPrices = function (t, info, priceToExpect) {
			var displayedPrice = '';
			var pf = info.priceFunction;
			for (var i = model.languages.length - 1; i >= 0; i -= 1) {
				var langId = model.languages[i].lang_id;
				var baseSel = $bookableModal.selector + ' tr.' + langId;
				for (var j = 0; j < info.places; j += 1) {
					var $pinput = $($(baseSel + ' input[name=prices\\.values]')[j]);
					t.l('Set price for ' + langId + j)
						.setValue($pinput,
							pf(i, j + 1, info.places));
				}
				if (model.language === langId) {
					priceToExpect.push(pf(i, j, info.places));
				}
			}
			return displayedPrice;
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