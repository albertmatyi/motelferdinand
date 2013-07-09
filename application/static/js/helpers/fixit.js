/*global define */
/*global $ */
/*global _ */
/*global document */
/*global window */

define(
[ 'lib/jquery' ],
function () {
	'use strict';

	var hexToRGBArr = function (hex) {
		var col = [hex >> 16 & 0xff, hex >> 8 & 0xff, hex & 0xff];
		return col;
	};
	var palette;
	palette = _.map([0xDD1E2F, 0xEBB035, 0x06A2CB, 0x218559, 0xD0C6B1, 0x192823], hexToRGBArr);
	// palette = _.map([0x292930, 0x4a4140, 0x168a83, 0xcca18e, 0x820132], hexToRGBArr);
	palette = _.map([0x422d61, 0xff4200, 0x247d28, 0x8a2022, 0x04756f], hexToRGBArr);

	var OBJECTS;

	var getColorFor = function (idx, mix) {
		var baseCol = palette[(idx + 1) % palette.length];
		if (mix !== 0) {
			var mixCol = palette[idx % palette.length];
			var col = [];
			for (var i = 2; i >= 0; i -= 1) {
				var diff = mixCol[i] - baseCol[i];
				col.unshift(Math.round(baseCol[i] + diff * mix));
			}
			return col;
		}
		return baseCol;
	};

	var scrollChanged = function () {
		var y = $(document).scrollTop();
		var lobjs = OBJECTS;
		var viewportH = $(window).height();
		var currentContainerIdx = 0;
		for (var i = lobjs.length - 1; i >= 0; i -= 1) {
			var $el = lobjs[i];
			var $container = $el.parent;
			var containerTop = $container.offset().top;
			var containerH = $container.outerHeight(true);
			var containerBottom = containerTop + containerH;
			var viewportBottom = y + viewportH;
			var top;
			var pos = 'absolute';
			if (y > containerBottom || viewportBottom < containerTop) {
				// the container is offscreen
				top = -10000;
			} else {
				var elH = $el.outerHeight(true);
				if (containerBottom - y < elH) { // el is starting to move offscreen
					top = containerBottom - elH;
					var t = 1 - (containerBottom - y) * 1.0 / elH;
					$('body').css('background-color', 'rgb(' + getColorFor(i, t).join(', ') + ')');
				} else if (containerTop < y) { // el should be fixed at top
					top = 0;
					pos = 'fixed';
					$('body').css('background-color', 'rgb(' + getColorFor(i, 0).join(', ') + ')');
				} else { // el should be at the beginning of the container
					top = containerTop;
				}
				currentContainerIdx = i;
			}
			$el.css({
				'position': pos,
				'top': top + 'px'
			});
			// $el.offset({'top': top});
		}
		return currentContainerIdx;
	};
	return {
		'setup': function ($objs) {
			var arr = [];
			for (var i = $objs.length - 1; i >= 0; i -= 1) {
				var $el = $($objs[i]);
				$el.css('position', 'absolute');
				$el.parent = $el.parent();
				arr.push($el);
			}

			OBJECTS = arr;
			$(window).scroll(scrollChanged);
			var curIdx = scrollChanged();
			$('body').css('background-color', 'rgb(' + getColorFor(curIdx, 0).join(', ') + ')');
		}
	};
});