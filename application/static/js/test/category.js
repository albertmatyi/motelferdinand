/*global define */
/*global $ */
/*global tl */

define([
		'lib/jquery'
	], 
	function (jquery) {
	var $addButton = $('.category-nav .add');
	var $catModal = $('#categoryEditFormModal');

	var testAddCategory = function () {
		tl('click add category');
		$addButton.click();
		tl('verify modal visible');

		tl('fill form with data');

		tl('click submit');

		tl('wait for response');

		tl('verify content is present');
	};

	var testDeleteCategory = function () {
		throw 'Not implemented';
	};

	return {
		'testAddCategory' : testAddCategory,
		'testDeleteCategory' : testDeleteCategory
	};
});