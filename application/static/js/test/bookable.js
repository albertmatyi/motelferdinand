/*global define */
/*global $ */
/*global model */
/*global _ */

define([
		'lib/jquery',
		'test/category',
		'test/dialog'
	],
	function (jquery, categoryTest, dialog) {
		"use strict";
		var $addDropdown;
		var $addButton;
		var $bookableModal;
		var bookableTitleStr = "BookableTitle";
		var categoryTitleStr = "categoryTitleForBookableTest";
		var $saveButton;
		var $category;
		var categoryId;

		var before = function (t) {
			categoryTest.createCategory(t, categoryTitleStr, function (categoryDomId) {
				t.l('Got category id ' + categoryDomId);
				$category = $('#' + categoryDomId);
				categoryId = /\d+/.exec(categoryDomId)[0];
				$addDropdown = $('.page-header .dropdown-toggle', $category);
				$addButton = $('.page-header .addBookableButton', $category);
				$bookableModal = $('#bookableEditFormModal');
				$saveButton = $('#submitBookableEditForm', $bookableModal);
			});
		};

		var after = function (t) {
			if ($category) {
				categoryTest.deleteCategory(t, categoryTitleStr);
			}
		};

		var testAddBookable = function (t) {
			createBookable(t, bookableTitleStr);
		};

		var createBookable = function (t, title) {
			var modelCount0;
			var modelCount1;

			t.addFunction(function () {
				modelCount0 = _.size(model.db.bookable);
				modelCount1 = _.size(model.db.category[categoryId].bookables);
			});

			t.l('click add bookable').click($addDropdown).waitAnimation().click($addButton).waitAnimation();

			t.l('verify modal visible').assertVisible($bookableModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $bookableModal), title);

			t.l('click submit').click($saveButton).waitAnimation();

			t.l('wait for response').waitXHR();

			t.l('verify bookable is present').assertPresent('.bookable-title:contains(' + bookableTitleStr + ')');

			t.l('Verify model entries').addFunction(function () {
				t.assertEquals(modelCount0 + 1, _.size(model.db.bookable), 'We should have ' + (modelCount0 + 1) + ' bookables');
				t.assertEquals(modelCount1 + 1, _.size(model.db.category[categoryId].bookables), 'We should have ' + (modelCount1 + 1) + ' bookables');
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

		var clickPage = function (t, nr) {
			t.$('.bookables-wrapper .pagination a:contains(' + nr + ')', function (el) {
				t.click(el);
			}, $category);
		};

		var testMultipleBookables = function (t) {
			createBookable(t, bookableTitleStr + '1');
			createBookable(t, bookableTitleStr + '2');
			clickPage(t, 2);
			clickPage(t, 1);
			deleteBookable(t, bookableTitleStr + '1');

			createBookable(t, bookableTitleStr + '3');

			clickPage(t, 2);
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