/*global define */
/*global $ */
/*global window */

define(
[
	'helpers/fixit'
],
function (fixit) {
	'use strict';
	return {
		init : function () {
			fixit.setup($('.category-info'));
			$('.category-nav a').click(function (e) {
				e.preventDefault();
				// e.stopImmediatePropagation();
				var href = $(this).attr('href');
				var $cat = $(href);
				$('html, body').animate({scrollTop: $cat.offset().top /*- 5 * 16 /*5em*/}, 1000, function () {
					window.location.hash = href.split('#')[1];
				});
				return false;
			});
		}
	};
});