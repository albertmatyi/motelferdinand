/*global define */
/*global $ */
/*global flags */

define(
[
	'view/bookable',
	'view/directives/menu',
	'view/directives/body',
	'view/common'
],
function (bookableView, navDirective, bodyDirective, common) {
	"use strict";
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
			if (flags.RENDER_HEADER) {
				$menu.render(data, navDirective);
			}

			if (flags.RENDER_CONTENT) {
				$container.render(data, bodyDirective);
			}

			if (flags.RENDER_GALLERIES) {
				common.renderContentGallery('.content-description div.picaslide, .category-description div.picaslide');
			}
			bookableView.render();
		}
	};
});