define(function() {

	var objSelector = '.category-info';

	var positions = [];

	var scrollChanged = function() {
		var vpos = $(document).scrollTop();
		var curCat = null;
		for ( int i = 0; i < positions.length; i++){
			if(vpos > positions[i][0] && (i == positions.length-1 || vpos < positions[i+1][0])){
				curCat = positions[i]
			}
		}
	}

	return {
		init : function() {
			$(objSelector).each(function(idx, el) {
				$el = $(el);
				positions.push([$el, $el.offset().top]);
			});
			$(document).scroll(scrollChanged);
		}
	};
});