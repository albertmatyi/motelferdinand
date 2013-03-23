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
		var $contentModal;
		var contentTitleStr = "ContentTitle";
		var categoryTitleStr = "categoryTitleForContentTest";
		var $saveButton;
		var $category;

		var before = function (t) {
			categoryTest.createCategory(t, categoryTitleStr, function (categoryId) {
				t.l('Got category id ' + categoryId);
				$category = $('#' + categoryId);
				$addDropdown = $('.page-header .dropdown-toggle', $category);
				$addButton = $('.page-header .addContentButton', $category);
				$contentModal = $('#contentEditFormModal');
				$saveButton = $('#submitContentEditForm', $contentModal);
			});
		};

		var after = function (t) {
			if ($category) {
				categoryTest.deleteCategory(t, categoryTitleStr);
			}
		};

		var testAddContent = function (t) {
			createContent(t, contentTitleStr);

			t.l('verify content is present').assertPresent('.content-title:contains(' + contentTitleStr + ')');
		};

		var createContent = function (t, title) {
			t.l('click add content').click($addDropdown).waitAnimation().click($addButton).waitAnimation();

			t.l('verify modal visible').assertVisible($contentModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $contentModal), title);

			t.l('click submit').click($saveButton).waitAnimation();

			t.l('wait for response').waitXHR();

		};

		var testDeleteContent = function (t) {
			var $delBtn = $('.content:contains(' + contentTitleStr + ') .admin-controls .delete', $category);
			var contentId = $delBtn.data('content-id');
			t.l('Deleting Content ' + contentId).click($delBtn).waitAnimation();

			t.l('Click OK to confirm delete').click(confirm.$ok).waitAnimation();

			t.l('wait server response & popup close').waitXHR();

			t.l('Verify content is no more present').assertNotPresent('#Content' + contentId);
		};

		var testEditContent = function (t) {
			var $editBtn = $('.content:contains(' + contentTitleStr + ') .admin-controls .edit', $category);
			var editedTitle = contentTitleStr + '2';
			var count = $('.content').length;

			t.l('Press edit button.').click($editBtn).waitAnimation();

			t.l('Modify title.').setValue($('*[name=i18n-en-title]', $contentModal), editedTitle);

			t.l('Click Save.').click($saveButton).waitAnimation();

			t.l('Wait for server response.').waitXHR();

			t.l('verify content is present').assertPresent('.content-title:contains(' + editedTitle + ')');

			t.l('Verify same number of cats.').assertCount(count, '.content');
		};

		return {
			'name' : 'Content',
			'before' : before,
			'after' : after,
			'tests' : [
				{ 'testAddContent' : testAddContent },
				{ 'testEditContent' : testEditContent },
				{ 'testDeleteContent' : testDeleteContent }
			],
			'createContent' : createContent
		};
	}
);