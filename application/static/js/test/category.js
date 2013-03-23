/*global define */
/*global $ */
/*global model */
/*global _ */

define([
		'lib/jquery',
		'test/confirm'
	],
	function (jquery, confirm) {
		"use strict";
		var $addButton;
		var $catModal;
		var categoryTitleStr = "categoryTitleForCategoryTest";
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

		var testAddDelete3Categories = function (t) {
			createCategory(t, categoryTitleStr + '1');
			createCategory(t, categoryTitleStr + '2');
			deleteCategory(t, categoryTitleStr + '1');
			createCategory(t, categoryTitleStr + '3');
			deleteCategory(t, categoryTitleStr + '3');
			deleteCategory(t, categoryTitleStr + '2');
		};

		var createCategory = function (t, title, callback) {
			if (typeof $addButton === 'undefined') {
				initControls();
			}
			t.l('Adding category ' + title);

			var modelCount0;
			var modelCount1;

			t.addFunction(function () {
				modelCount0 = _.size(model.db.category);
				modelCount1 = _.size(model.categories);
			});

			t.l('click add category').click($addButton).waitAnimation();

			t.l('verify modal visible').assertVisible($catModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $catModal), title);

			t.l('click submit').click($saveButton);

			t.l('wait for response').waitXHR();

			t.l('Verify model entries').addFunction(function () {
				t.assertEquals(modelCount0 + 1, _.size(model.db.category), 'We should have ' + (modelCount0 + 1) + ' categories');
				t.assertEquals(modelCount1 + 1, _.size(model.categories), 'We should have ' + (modelCount1 + 1) + ' categories');
			});


			if (callback) {
				t.l('after createCategory method').addFunction(function () {
					callback($('.category:contains(' + title + ')').attr('id'));
				});
			}
		};

		var testDeleteCategory = function (t) {
			deleteCategory(t, categoryTitleStr);
		};

		var deleteCategory = function (t, title) {
			t.l('Deleting category ' + title);

			t.$('.category:contains(' + title + ')', function (el) {
				var categoryId = el.attr('id');
				var $delBtn = $('#' + categoryId + ' .page-header .admin-controls .delete');

				var modelCount0 = _.size(model.db.category);
				var modelCount1 = _.size(model.categories);

				t.l('Deleting ' + categoryId).click($delBtn).waitAnimation();

				t.l('Click OK to confirm delete').click(confirm.$ok);

				t.l('wait server response').waitXHR();

				t.l('Verify category is no more present').assertNotPresent('#' + categoryId);

				t.l('Verify model entries').addFunction(function () {
					t.assertEquals(modelCount0 - 1, _.size(model.db.category), 'We should have ' + (modelCount0 - 1) + ' categories');
					t.assertEquals(modelCount1 - 1, model.categories.length, 'We should have ' + (modelCount1 - 1) + ' categories');
				});
			});
		};

		var testEditCategory = function (t) {
			var $editBtn = $('.page-header:contains(' + categoryTitleStr + ') .admin-controls .edit');
			var editedTitle = categoryTitleStr + '2';
			var count = $('.category').length;

			t.l('Press edit button.').click($editBtn).waitAnimation();

			t.l('Modify title.').setValue($('*[name=i18n-en-title]', $catModal), editedTitle);

			t.l('Click Save.').click($saveButton).waitAnimation();

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
				{ 'testDeleteCategory' : testDeleteCategory },
				{ 'testAddDelete3Categories' : testAddDelete3Categories }
			],
			'createCategory' : createCategory,
			'deleteCategory' : deleteCategory
		};
	}
);