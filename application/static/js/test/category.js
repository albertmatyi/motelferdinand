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

		var testAddCategory = function (t) {
			t.l('click add category').click($addButton);

			t.l('verify modal visible').assertVisible($catModal);

			t.l('fill form with data').setValue($('*[name=i18n-en-title]', $catModal), catTitleStr);

			t.l('click submit').click($saveButton);

			t.waitXHR();

			t.l('verify content is present').assertPresent('h1.category-title:contains(' + catTitleStr + ')');
		};

		var testDeleteCategory = function (t) {
			throw 'Not implemented';
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
				{ 'testDeleteCategory' : testDeleteCategory }
			]
		};
	}
);