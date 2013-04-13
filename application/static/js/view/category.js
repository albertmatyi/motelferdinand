/*global define */
/*global $ */

define(
[
	'config',
	'view/bookable',
	'view/directives/menu',
	'view/directives/body',
	'view/common'
],
function (config, bookableView, navDirective, bodyDirective, common) {
	'use strict';
	var $menu = $('.category-nav');
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
				$container.render(data, bodyDirective);
			}

			if (config.RENDER_GALLERIES) {
				common.renderContentGallery('.content-description div.picaslide, .category-description div.picaslide');
			}
			bookableView.render();
		}
	};
});