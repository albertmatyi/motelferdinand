/*global define */
/*global $ */
/*global window */

define(
[
	'lib/jquery'
],
function () {
	'use strict';
    var COLORS = ['turquoise', 'green-sea', 'emerald', 'nephritis', 'peter-river', 'belize-hole', 'amethyst', 'wisteria', 'wet-asphalt', 'midnight-blue', 'sun-flower', 'orange', 'carrot', 'pumpkin', 'alizarin', 'pomegranate', 'clouds', 'silver', 'concrete', 'asbestos'];
    var COL_MAP = [0,1,2,3,4,6];

    var addColors = function () {
        $('.category').each(function (idx, el) {
            var $el = $(el);
            if (idx === 0) {
                $el.removeClass('col-md-4').addClass('col-md-8');
            }
//            var color = Math.floor(Math.random() * COLORS.length/2) * 2;
            var color = COLORS[COL_MAP[idx % COL_MAP.length] * 2];
            $el.addClass('palette palette-' + color);
        });
    };
    return {
		init : function () {
			addColors();

			// DEFAULT SELECTION
			if (window.location.hash.length > 1) {
//				scrollToAnchor(window.location.hash);
                console.log("TODO: open cat");
			}
			$('#loading-overlay').animate({top: -$(window).height()}, 1000, function () {
				$(this).remove();
			});
		}
	};
});