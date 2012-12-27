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

            common.renderContentGallery('.content-description div.picaslide', $el);
		}
	};
});