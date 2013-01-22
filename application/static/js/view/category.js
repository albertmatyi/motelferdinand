define(
[
'view/booking',
'view/directives/menu',
'view/directives/body',
'view/common'
], 	
function(bookingView, navDirective, bodyDirective, common){
	var $menu = $('.category-nav');
	var $container = $('.categories');
	var menuTemplate = $menu.html();
	var categoryTemplate = $container.html();

	return {
		'menu': $menu,
		'container': $container,
		'menuTemplate' : menuTemplate,
		'categoryTemplate' : categoryTemplate,
		'render': function(data){
			flags.RENDER_HEADER &&
				$menu.render(data, navDirective);

			flags.RENDER_CONTENT &&
				$container.render(data, bodyDirective);
			
			flags.RENDER_GALLERIES && 
				common.renderContentGallery('.content-description div.picaslide, .category-description div.picaslide');

			bookingView.render();
		}
	};
});