/*global define */
/*global $ */
/*global window */

define(
[
	'helpers/fixit',
	'lib/jquery'
],
function (fixit) {
	'use strict';

	var scrollToAnchor = function (href) {
		var $cat = $(href);
		var scrollF = function () {
			var os = $cat.offset()
			if (!os) {
				setTimeout(scrollF, 250);
			} else {
				$('html, body').animate({scrollTop: os.top /*- 5 * 16 /*5em*/}, 1000, function () {
					window.location.hash = href.split('#')[1];
				});
			}
		};
		scrollF();
	};
	return {
		init : function () {
			fixit.setup($('.category-info'));
			$('.category-nav a').click(function (e) {
				e.preventDefault();
				var href = $(this).attr('href');
				scrollToAnchor(href);
				return false;
			});
			// DEFAULT SELECTION
			if (window.location.hash.length > 1) {
				scrollToAnchor(window.location.hash);
			}
		}
	};
});