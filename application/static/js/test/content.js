/*global define */
/*global $ */
/*global _ */
/*global model */

define([
		'lib/jquery',
		'test/category',
		'test/elements/dialog'
	],
	function (jquery, categoryTest, dialog) {
		'use strict';
		var $addDropdown;
		var $addButton;
		var $contentModal;
		var contentTitleStr;
		var categoryTitleStr;
		var $saveButton;
		var $category;
		var categoryId = -1;

		var before = function (t) {
			contentTitleStr = 'Content Title' + t.hash();
			categoryTitleStr = 'Test Category for Content' + t.hash();
			categoryTest.createCategory(t, categoryTitleStr, function ($cat) {
				t.l('Got category id ' + $cat.selector);
				$category = $cat;
				categoryId = /\d+/.exec($cat.attr('id'))[0];
				$addDropdown = $('.info-container .dropdown-toggle', $category);
				$addButton = $('.info-container .addContentButton', $category);
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
		};

		var createContent = function (t, title) {
			var modelCount0;
			var modelCount1;

			t.addFunction(function () {
				modelCount0 = _.size(model.db.content);
				modelCount1 = _.size(model.db.category[categoryId].contents);
			});

			t.l('click add content').click($addDropdown).waitAnimation().click($addButton).waitAnimation();

			t.l('verify modal visible').assertVisible($contentModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $contentModal), title);

			t.l('click submit').click($saveButton).waitAnimation();

			t.l('wait for response').waitXHR();

			t.l('verify modal invisible').assertInvisible($contentModal);

			t.l('verify content is present').assertPresent('.content-title:contains(' + title + ')');

			t.l('Verify model entries').addFunction(function () {
				t.assertEquals(modelCount0 + 1, _.size(model.db.content), 'We should have ' + (modelCount0 + 1) + ' contents');
				t.assertEquals(modelCount1 + 1, _.size(model.db.category[categoryId].contents), 'We should have ' + (modelCount1 + 1) + ' contents');
			});
		};

		var testMultipleContents = function (t) {
			createContent(t, contentTitleStr + '1');
			createContent(t, contentTitleStr + '2');

			deleteContent(t, contentTitleStr + '1');

			createContent(t, contentTitleStr + '3');

			deleteContent(t, contentTitleStr + '3');
			deleteContent(t, contentTitleStr + '2');
		};

		var testDeleteContent = function (t) {
			deleteContent(t, contentTitleStr);
		};

		var deleteContent = function (t, title) {
			t.$('.content:contains(' + title + ') .admin-controls .delete', function ($delBtn) {
				var modelCount0;
				var modelCount1;

				t.addFunction(function () {
					modelCount0 = _.size(model.db.content);
					modelCount1 = _.size(model.db.category[categoryId].contents);
				});
				var contentId = $delBtn.data('content-id');
				t.l('Deleting Content ' + contentId).click($delBtn);

				t.l('Click OK to confirm delete').waitAnimation().click(dialog.confirmation.ok);

				t.l('wait server response').waitXHR().l('click alert ok').waitAnimation().click(dialog.alert.ok);

				t.l('Verify content is no more present').assertNotPresent('#Content' + contentId);
				t.l('Verify model entries').addFunction(function () {
					t.assertEquals(modelCount0 - 1, _.size(model.db.content), 'We should have ' + (modelCount0 - 1) + ' contents');
					t.assertEquals(modelCount1 - 1, _.size(model.db.category[categoryId].contents), 'We should have ' + (modelCount1 - 1) + ' contents');
				});
			}, $category);
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
				{ 'testDeleteContent' : testDeleteContent },
				{ 'testMultipleContents' : testMultipleContents }
			]
		};
	}
);