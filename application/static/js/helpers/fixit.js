/*global define */
/*global $ */

define(
[],
function () {
	"use strict";
	var scrollChanged = function ($objs2Fix) {
		var st = $(document).scrollTop();
		$objs2Fix.each(function (i, el) {
			var $el = $(el);
			var $parent = $el.parent();
			var pos = Math.max(st, $parent.offset().top);
			pos = Math.min(pos, $parent.offset().top + $parent.outerHeight(true) - $el.outerHeight(true));
			$el.offset({top : pos});
		});
	};
	return {
		'setup': function ($objs) {
			$(document).scroll(function () {
				scrollChanged($objs);
			});
		}
	};
});