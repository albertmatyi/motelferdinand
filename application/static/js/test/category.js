/*global define */
/*global $ */

define([
		'lib/jquery'
	],
	function (jquery) {
		"use strict";
		var $addButton;
		var $catModal;
		var catTitleStr = "CatTitle";
		var catDescrStr = "CatDescr";
		var $saveButton;
		var confirm = {
			'$ok' : $("#confirmationModal .modal-footer .btn-primary")
		};

		var testAddCategory = function (t) {
			t.l('click add category').click($addButton).wait(200);

			t.l('verify modal visible').assertVisible($catModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $catModal), catTitleStr);

			t.l('click submit').click($saveButton);

			t.l('wait for response').waitXHR();

			t.l('verify content is present').assertPresent('h1.category-title:contains(' + catTitleStr + ')');
		};

		var testDeleteCategory = function (t) {
			var $delBtn = $('.page-header:contains(' + catTitleStr + ') .admin-controls .delete');
			var catId = $delBtn.data('category-id');
			t.l('Deleting Category ' + catId).click($delBtn);
			
			t.l('Click OK to confirm delete').click(confirm.$ok);
			
			t.l('wait server response & popup close').wait(2000);
			
			t.l('Verify category is no more present').assertNotPresent('#Category' + catId);
		};

		var setup = function (t) {
			$addButton = $('.category-nav .add');
			$catModal = $('#categoryEditFormModal');
			$saveButton = $('#submitCategoryEditForm', $catModal);
		};

		return {
			'setup' : setup,
			'tests' : [
				{ 'testAddCategory' : testAddCategory },
				// { 'testDeleteCategory' : testEditCategory },
				{ 'testDeleteCategory' : testDeleteCategory }
			]
		};
	}
);