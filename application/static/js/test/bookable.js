/*global define */
/*global $ */

define([
		'lib/jquery',
		'test/category',
		'test/confirm'
	],
	function (jquery, categoryTest, confirm) {
		"use strict";
		var $addDropdown;
		var $addButton;
		var $bookableModal;
		var bookableTitleStr = "BookableTitle";
		var categoryTitleStr = "categoryTitleForBookableTest";
		var $saveButton;
		var $category;

		var before = function (t) {
			categoryTest.createCategory(t, categoryTitleStr, function (categoryId) {
				t.l('Got category id ' + categoryId);
				$category = $('#' + categoryId);
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

			t.l('verify bookable is present').assertPresent('.bookable-title:contains(' + bookableTitleStr + ')');
		};

		var createBookable = function (t, title) {
			t.l('click add bookable').click($addDropdown).waitAnimation().click($addButton).waitAnimation();

			t.l('verify modal visible').assertVisible($bookableModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $bookableModal), title);

			t.l('click submit').click($saveButton).waitAnimation();

			t.l('wait for response').waitXHR();

		};

		var testDeleteBookable = function (t) {
			var $delBtn = $('.bookable:contains(' + bookableTitleStr + ') .admin-controls .delete', $category);
			var bookableId = $delBtn.data('bookable-id');
			t.l('Deleting Bookable ' + bookableId).click($delBtn).waitAnimation();

			t.l('Click OK to confirm delete').click(confirm.$ok).waitAnimation();

			t.l('wait server response & popup close').waitXHR();

			t.l('Verify bookable is no more present').assertNotPresent('#Bookable' + bookableId);
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
				{ 'testDeleteBookable' : testDeleteBookable }
			],
			'createBookable' : createBookable
		};
	}
);