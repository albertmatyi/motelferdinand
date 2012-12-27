define(
[
	'helpers/picaslide'
], function(){
	return{
		'renderContentGallery' : function (selector){
			$(selector).each(function(idx, el) {
				var $el = $(el);
				$el.picaslide({pause: 5000, hoverPause: true, slideSpeed: 850});
			});
		}
	};
});