/*global define */
/*global $ */
/*global window */

define([
	'lib/jquery'
], function () {
	var bgBaseURL = '/static/img/bgs/';
	var markers;

	var getCatIdx = function (scrollTop) {
		var i = 0;
		while (i < markers.length && markers[i] < scrollTop) {
			i += 1;
		}
		return i === markers.length ? markers.length - 1:i;
	};

	var calcBg = function (force, scrollTopOverride) {
		if (force !== true && $('body.on-first-page').length > 0) {
			return;
		}
		var $w = $(window);
		var wH = $w.height();
		var st = scrollTopOverride || $w.scrollTop();
		var idx = getCatIdx(st);
		var vpos = parseInt((markers[idx] - wH - st) / 3, 10);
		var imgIdx = idx % 8 + 1;
		$('#body-bg').css({
			'background-image': 'url(' + bgBaseURL + imgIdx + '.jpg)',
			'background-position': '50% ' + vpos + 'px'
		});
	};

	var setup = function (selector) {
		markers = [];
		$(selector).each(function (idx, el) {
			markers.push(
				$(el).offset().top
			);
		});
		$(window).on('scroll', calcBg);
		calcBg(true, $('#hero').height());
	};

	return {
		'setup': setup
	};
});