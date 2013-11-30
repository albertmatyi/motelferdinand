/*global define */
/*global $ */

define(
[
	'lib/jquery',
	'config',
	'view/bookable_variant',
	'view/directives/menu',
	'view/directives/body',
	'view/common'
],
function (jq, config, bookableVariantView, navDirective, bodyDirective, common) {
	'use strict';
	var $menu = $('.navbar .category-nav');
	var $container = $('.categories');
	var menuTemplate = $menu.html();
	var categoryTemplate = $container.html();

	return {
		'menu': $menu,
		'container': $container,
		'menuTemplate' : menuTemplate,
		'categoryTemplate' : categoryTemplate,
		'render': function (data) {
			if (config.RENDER_HEADER) {
				$menu.render(data, navDirective);
			}

			if (config.RENDER_CONTENT) {
				console.log(bodyDirective);
				$container.render(data, bodyDirective);
			}
		}
	};
});