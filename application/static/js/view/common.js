define(
[
	'helpers/picaslide'
], function(){
	return{
		'renderContentGallery' : function (selector){
			$(selector).each(function(idx, el) {
				var $el = $(el);
				$el.addClass('span4');
				$el.picaslide({pause: 5000, hoverPause: true, slideSpeed: 850});
			});
		}
	};
});