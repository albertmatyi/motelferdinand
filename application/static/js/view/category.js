define(
[
'view/booking',
'view/directives/menu',
'view/directives/body',
'view/common',
'helpers/transparency',
'controllers/admin/content',
'controllers/admin/bookable'
], 	
function(bookingView, navDirective, bodyDirective, common	, transparency, adminContent, adminBookable){
	var $menu = $('.category-nav');
	var $content = $('.categories');
	var menuTemplate = $menu.html();
	var categoryTemplate = $content.html();

	return {
		'menu': $menu,
		'content': $content,
		'render': function(data){
			flags.RENDER_HEADER &&
				$menu.render(data, navDirective);

			if(flags.RENDER_CONTENT){
				$content.render(data, bodyDirective);
				// $('.content.span4').contentss('margin-left',parseInt($('.content.span4').css('margin-left'))*.5+'px');
			}
			
			flags.RENDER_GALLERIES && 
				common.renderContentGallery('.content-description div.picaslide, .category-description div.picaslide');

			bookingView.render();
		},
		'add': function(entity){
			var $el = transparency.render(menuTemplate, entity, navDirective);
			$menu.append($el);
			$el = transparency.render(categoryTemplate, entity, bodyDirective);
			
            $content.append($el);

            bookingView.render($el);
            adminContent.initAddButton($el);
            adminBookable.initAddButton($el);
		}
	};
});