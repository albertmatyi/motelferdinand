/*global define */
/*global $ */

define([
	'lib/jquery'
], function () {
	'use strict';

	var $progress = $('.app-progress-indicator').remove();
	var DEFAULT_TXT = $('.bar', $progress).text();

	var show = function ($places, text) {
		text = text || DEFAULT_TXT;

		$places.each(function (i, place) {
			var $place = $(place);
			if (!$place.is(':visible')) {
				return;
			}
			var $pb = $progress.clone();
			$('.bar', $pb).text(text);
			$pb.css({
				'width': $place.outerWidth() + 'px',
				'height': $place.outerHeight() + 'px',
				'top': $place.offset().top + 'px',
				'left': $place.offset().left + 'px'
			});

			var $p = $('.progress', $pb);
			$p.css({
				'margin-top': ($place.outerHeight() - $p.outerHeight()) / 2 + 'px'
			});

			$('body').append($pb);
			$pb.show();
		});
	};

	var hide = function () {
		$('.app-progress-indicator').remove();
	};
	return {
		'show': show,
		'hide': hide
	};
});