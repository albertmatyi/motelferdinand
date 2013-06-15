/*global define */
/*global $ */

define(['lib/jquery'], function () {
	'use strict';

	var moveToCategory = function (entity, type, categoryId, successCallback) {
		$.ajax({
			'method': 'POST',
			'url': '/admin/' + type + '/move/' + entity.id,
			'type': 'json',
			'data': {'data': JSON.stringify({'id': entity.id, 'category_id': categoryId})},
			'success': function (data) {
				successCallback(categoryId);
			}
		});
	};

	var initMoveToCategory = function ($moveToCategoryElement, entity, type, successCallback) {
		$moveToCategoryElement.show();
		var opts = [];
		for (var i = model.categories.length - 1; i >= 0; i--) {
			var cat = model.categories[i];
			opts.unshift('<li data-category="' + cat.id + '"><a>' +
				cat.i18n[model.language].title +
				'</a></li>');
		}
		$('.dropdown-menu', $moveToCategoryElement)
			.html(opts.join(''))
			.off('click')
			.on('click', 'li', function (event) {
				event.preventDefault();
				moveToCategory(entity, type, $(this).data('category'), successCallback);
			});
	};

	return {
		'initMoveToCategory': initMoveToCategory
	};
});