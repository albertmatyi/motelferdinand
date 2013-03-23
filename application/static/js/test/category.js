/*global define */
/*global $ */

define([
		'lib/jquery',
		'test/confirm'
	],
	function (jquery, confirm) {
		"use strict";
		var $addButton;
		var $catModal;
		var categoryTitleStr = "CatTitle";
		var $saveButton;

		var initControls = function () {
			$addButton = $('.category-nav .add');
			$catModal = $('#categoryEditFormModal');
			$saveButton = $('#submitCategoryEditForm', $catModal);
		};

		var before = function () {
			initControls();
		};

		var testAddCategory = function (t) {
			createCategory(t, categoryTitleStr);

			t.l('verify content is present').assertPresent('.category-title:contains(' + categoryTitleStr + ')');
		};

		var createCategory = function (t, title, callback) {
			if (typeof $addButton === 'undefined') {
				initControls();
			}
			t.l('click add category').click($addButton).wait(200);

			t.l('verify modal visible').assertVisible($catModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $catModal), title);

			t.l('click submit').click($saveButton);

			t.l('wait for response').waitXHR();

			if (callback) {
				t.l('after createCategory method').addFunction(function () {
					callback($('.category:contains(' + title + ')').attr('id'));
				});
			}
		};

		var testDeleteCategory = function (t) {
			var categoryId =  $('.category:contains(' + categoryTitleStr + ')').attr('id');
			deleteCategory(t, categoryId);
		};

		var deleteCategory = function (t, categoryId) {
			var $delBtn = $('#' + categoryId + ' .page-header .admin-controls .delete');
			t.l('Deleting ' + categoryId).click($delBtn);

			t.l('Click OK to confirm delete').click(confirm.$ok);

			t.l('wait server response & popup close').waitXHR();

			t.l('Verify category is no more present').assertNotPresent('#' + categoryId);
		};

		var testEditCategory = function (t) {
			var $editBtn = $('.page-header:contains(' + categoryTitleStr + ') .admin-controls .edit');
			var editedTitle = categoryTitleStr + '2';
			var count = $('.category').length;

			t.l('Press edit button.').click($editBtn);

			t.l('Modify title.').setValue($('*[name=i18n-en-title]', $catModal), editedTitle);

			t.l('Click Save.').click($saveButton);

			t.l('Wait for server response.').waitXHR();

			t.l('verify content is present').assertPresent('.category-title:contains(' + editedTitle + ')');

			t.l('Verify same number of cats.').assertCount(count, '.category');
		};

		return {
			'name' : 'Category',
			'before' : before,
			'tests' : [
				{ 'testAddCategory' : testAddCategory },
				{ 'testEditCategory' : testEditCategory },
				{ 'testDeleteCategory' : testDeleteCategory }
			],
			'createCategory' : createCategory,
			'deleteCategory' : deleteCategory
		};
	}
);