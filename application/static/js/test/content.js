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
		var categoryTitleStr = "categoryTitleStr";
		var $saveButton;
		var $category;

		var before = function (t) {
			categoryTest.createCategory(t, categoryTitleStr, function (categoryId) {
				$category = $(categoryId);
				$addDropdown = $('.page-header .dropdown-toggle', $category);
				$addButton = $('.page-header .addContentButton', $category);
				$contentModal = $('#contentEditFormModal');
				$saveButton = $('#submitContentEditForm', $contentModal);
			});
		};

		var after = function (t) {
			categoryTest.deleteCategory($category.attr('id'));
		};

		var testAddContent = function (t) {
			createContent(t, contentTitleStr);

			t.l('verify content is present').assertPresent('h1.content-title:contains(' + contentTitleStr + ')');
		};

		var createContent = function (t, title) {
			t.l('click add content').click($addButton).wait(200);

			t.l('verify modal visible').assertVisible($contentModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $contentModal), contentTitleStr);

			t.l('click submit').click($saveButton);

			t.l('wait for response').waitXHR();

			return $('.content:contains(' + title + ')').attr('id');
		};

		var testDeleteContent = function (t) {
			var $delBtn = $('.page-header:contains(' + contentTitleStr + ') .admin-controls .delete');
			var catId = $delBtn.data('content-id');
			t.l('Deleting Content ' + catId).click($delBtn);

			t.l('Click OK to confirm delete').click(confirm.$ok);

			t.l('wait server response & popup close').wait(2000);

			t.l('Verify content is no more present').assertNotPresent('#Content' + catId);
		};

		var testEditContent = function (t) {
			var $editBtn = $('.page-header:contains(' + contentTitleStr + ') .admin-controls .edit');
			var editedTitle = contentTitleStr + '2';
			var count = $('.content').length;

			t.l('Press edit button.').click($editBtn);

			t.l('Modify title.').setValue($('*[name=i18n-en-title]', $contentModal), editedTitle);

			t.l('Click Save.').click($saveButton);

			t.l('Wait for server response.').waitXHR();

			t.l('verify content is present').assertPresent('h1.content-title:contains(' + editedTitle + ')');

			t.l('Verify same number of cats.').assertEquals(count, $('.content').length);
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