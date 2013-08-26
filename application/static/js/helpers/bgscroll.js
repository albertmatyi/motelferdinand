/*global define */
/*global $ */
/*global window */

define([
	'lib/jquery'
], function () {
	var bgBaseURL = '/static/img/bgs/';
	var SELECTOR;

	var calcBg = function () {
		var $w = $(window);
		var st = $w.scrollTop();
		var idx = 1;
		// var w = 500;
		var h = $w.height();
		var vpos = parseInt(-st / 3);
		$('#body-bg').css({
			'background-image': 'url(' + bgBaseURL + idx + '.jpg)',
			'background-position': '50% ' + vpos + 'px'
		});
	};

	var setup = function (selector) {
		SELECTOR = selector;

		$(window).on('scroll', calcBg);
		calcBg();
	};

	return {
		'setup': setup
	};
});