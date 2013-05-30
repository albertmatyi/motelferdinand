/*global define */
/*global $ */
/*global document */

define(
[ 'lib/jquery' ],
function () {
	'use strict';

	var OBJECTS;

	var scrollChanged = function () {
		var st = $(document).scrollTop();
		var lobjs = OBJECTS;
		for (var i = lobjs.length - 1; i >= 0; i--) {
			var $el = lobjs[i];
			var $parent = $el.parent;
			var parentTopOffset = $parent.offset().top;
			var pos = Math.max(st, parentTopOffset);
			pos = Math.min(pos, parentTopOffset + $parent.outerHeight(true) - $el.outerHeight(true));
			$el.offset({top : pos});
		}
	};
	return {
		'setup': function ($objs) {
			var arr = [];
			for (var i = $objs.length - 1; i >= 0; i--) {
				var $el = $($objs[i]);
				$el.parent = $el.parent();
			}

			OBJECTS = arr;
			$(window).scroll(scrollChanged);
		}
	};
});