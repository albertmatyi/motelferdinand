/*global define */
/*global $ */

define(
[
	'config',
	'lib/datepicker'
],
function (config) {
	'use strict';
	// BOOKING
	function renderDatePickers($context) {
		$('.datepicker', $context).datepicker({
			format: 'dd-mm-yyyy',
			todayHighlight : true,
			todayBtn : true,
			autoclose : true
		});
	}

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

		if (config.RENDER_DATEPICKERS) {
			renderDatePickers($context);
		}
	};
	return {
		'render': render,
		'renderGallery' : renderGallery
	};
});