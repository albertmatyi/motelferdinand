define(
[
	'view/common',
	'helpers/transparency',
	'view/directives/content'
], 	
function(common, transparency, directive){
	var template = $('.contents').html();

	return {
		'add': function(entity){
			var $el = transparency.render(template, entity, directive);
			$('#Category'+entity.category + ' .contents').append($el);
			$el = transparency.render(categoryTemplate, entity, bodyDirective);

            // $('.content.span4', $el).css('margin-left', parseInt($('.content.span4').css('margin-left'))*.5+'px');

            bookingView.render($el);
            adminContent.initAddButton($el);
            adminBookable.initAddButton($el);
		}
	};
});