define(function() {
	/**
	 * The selector of the objects to animate 
	 */
	var objSelector = '.category-info';
	/**
	 * The number of pixels from the bottom of a category, where to start 
	 * animating the title
	 */
	var TRANSITION_DIST = parseInt($('.category').css('margin-bottom'));
	/**
	 * This is how much percent of the screen height the title can move while 
	 * active [0, 1]
	 */
	var ACTIVE_MOVE_PERC = .05;
	/**
	 * 
	 */
	var DISP = 0;
	/**
	 * Stores the original positions of the elements 	
	 */
	var positions = [];

	var scrollChanged = function() {
		var vPos = $(document).scrollTop();
		var curIdx = -1;
		
		for ( var i = 0; i < positions.length; i++){
			if(vPos > positions[i][1] && (i == positions.length-1 || vPos < positions[i+1][1])){
				curIdx = i;
				break;
			}
		}
		if (curIdx > -1 && curIdx < positions.length-1){
			var elYStart = positions[curIdx][1];
			var elYEnd = positions[curIdx+1][1];
			var hWin = $(window).height();
			var $curEl = positions[curIdx][0];
			var $nextEl = positions[curIdx+1][0];
			var perc = (vPos+DISP - elYStart) / (elYEnd - elYStart);
			var nextElPos = null;
			var curElPos = null;
			console.log(perc);
			if(perc > 1-START_PERC){
				// move the next one in
				nextElPos = vPos + hWin * Math.cos ((perc-1+START_PERC)*(1/START_PERC)*Math.PI / 2);
				curElPos= vPos + hWin * (ACTIVE_MOVE_PERC + Math.cos(1/START_PERC*Math.PI/2 * (perc-1+START_PERC) + Math.PI/2));
				
				$nextEl.offset({top: nextElPos});
			} else {
				curElPos = vPos + hWin * ACTIVE_MOVE_PERC * Math.sin(perc / (1-START_PERC)*Math.PI/2);
			}
			$curEl.offset({top: curElPos});
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