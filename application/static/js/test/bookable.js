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
		var bookableTitleStr;
		var categoryTitleStr;
		var beds = 3;
		var quantity = 4;
		var price = 69;
		var $saveButton;
		var $category;
		var categoryId;

		var before = function (t) {
			bookableTitleStr = 'Bookable Title' + t.hash();
			categoryTitleStr = 'Test Category for Bookable' + t.hash();
			categoryTest.createCategory(t, categoryTitleStr, function ($cat) {
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
				categoryTest.deleteCategory(t, categoryTitleStr);
			}
		};

		var testAddBookable = function (t) {
			createBookablePvt(t, bookableTitleStr, $category);
		};

		var createBookable = function (t, title, $cat, callback) {
			initVars(t, $cat);
			createBookablePvt(t, title, $cat);
			if (typeof callback !== 'undefined') {
				t.l('after createBookable method').addFunction(function () {
					callback($('.bookable:contains(' + title + ')'));
				});
			}
		};

		var createBookablePvt = function (t, title, $cat) {
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

			t.l('fill form title').setValue($('*[name=i18n-en-title]', $bookableModal), title);

			t.l('fill form beds').setValue($('*[name=beds]', $bookableModal), beds);

			t.l('fill form quantity').setValue($('*[name=quantity]', $bookableModal), quantity);

			t.l('fill form price').setValue($('*[name=price]', $bookableModal), price);

			t.l('click submit').click($saveButton).waitAnimation();

			t.l('wait for response').waitXHR();

			t.l('verify bookable is present').$('.bookable:contains(' + title + ')', function ($bookable) {

				t.l('verify beds').assertPresent('.beds:contains(' + beds + ')', $bookable);

				t.l('verify price').assertPresent('.price:contains(' + price + ')', $bookable);

			});

			t.l('Verify model entries').addFunction(function () {
				t.assertEquals(modelCount0 + 1, _.size(model.db.bookable), 'We should have ' + (modelCount0 + 1) + ' bookables');
				t.assertEquals(modelCount1 + 1, _.size(model.db.category[catId].bookables), 'We should have ' + (modelCount1 + 1) + ' bookables');
			});
		};

		var testDeleteBookable = function (t) {
			deleteBookable(t, bookableTitleStr);
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
			createBookablePvt(t, bookableTitleStr + '1', $category);
			createBookablePvt(t, bookableTitleStr + '2', $category);
			deleteBookable(t, bookableTitleStr + '1');

			createBookablePvt(t, bookableTitleStr + '3', $category);

			deleteBookable(t, bookableTitleStr + '3');
			deleteBookable(t, bookableTitleStr + '2');
		};

		var testEditBookable = function (t) {
			var $editBtn = $('.bookable:contains(' + bookableTitleStr + ') .admin-controls .edit', $category);
			var editedTitle = bookableTitleStr + '2';
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