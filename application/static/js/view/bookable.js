/*global define */
/*global $ */

define(
[
	'lib/jquery',
	'config'
],
function (jq, config) {
	'use strict';
	
	var renderGallery = function ($context) {
		if (config.RENDER_BOOKING_GALLERIES) {
			$('.bookable-picaslide', $context).each(function (idx, el) {
				var $el = $(el);
				$el.addClass('span4');
				$el.picaslide({effect: 'fade', pause: 5000, hoverPause: true, slideSpeed: 850});
			});
		}
	};

	var render = function ($context) {
		if (typeof($context) === 'undefined') {
			$context = $('body');
		}

		renderGallery($context);
	};
	return {
		'render': render,
		'renderGallery' : renderGallery
	};
});