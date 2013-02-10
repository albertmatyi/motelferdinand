define(
[
	'controllers/booking'
],
function(booking) {
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
			var elY0 = positions[curIdx][1];
			var elY1 = positions[curIdx+1][1];
			var hWin = $(window).height();
			var $curEl = positions[curIdx][0];
			var $nextEl = positions[curIdx+1][0];
			var nextElPos = null;
			var curElPos = null;
			var transStartRel = elY1 - elY0 - TRANSITION_DIST;
			var vPosRel = vPos - elY0;
			if(vPosRel > transStartRel){
				// move the next one in		
				perc = (vPosRel - transStartRel) / TRANSITION_DIST;
				nextElPos = vPos + hWin * Math.cos (perc*Math.PI / 2);
				curElPos= vPos + hWin * (ACTIVE_MOVE_PERC + Math.cos(Math.PI/2*perc + Math.PI/2));
				$nextEl.offset({top: nextElPos});
			} else {
				perc = vPosRel / transStartRel;
				curElPos = vPos + hWin * ACTIVE_MOVE_PERC * Math.sin(perc * Math.PI/2);
			}
			$curEl.offset({top: curElPos});
		}
	}

	return {
		init : function() {
			$(objSelector).each(function(idx, el) {
				var $el = $(el);
				positions.push([$el, $el.offset().top]);
			});
			$(document).scroll(scrollChanged);
			booking.setup();
		}
	};
});