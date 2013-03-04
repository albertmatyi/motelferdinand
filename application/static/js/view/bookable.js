/*global define */
/*global $ */
/*global flags */

define(
[
	'lib/datepicker'
],
function () {
	"use strict";
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
		if (flags.RENDER_BOOKING_GALLERIES) {
			$('.bookable-picaslide', $context).each(function (idx, el) {
				var $el = $(el);
				$el.addClass('span4');
				$el.picaslide({effect: 'fade', pause: 5000, hoverPause: true, slideSpeed: 850});
			});
		}
	};

	var render = function ($context) {
		if (typeof($context) === "undefined") {
			$context = $('body');
		}
		$('.bookables-wrapper', $context).each(function (idx, el) {
			var $el = $(el);
			var l = $('.bookable', el).length;
			if (flags.RENDER_BOOKING && l > 0) {
				var tmpW = $el.width();
				$('.bookable', el).css('width', tmpW + 'px');
				$('.bookables', el).css('width', tmpW + 'px');
				$('.bookables-slide-wrapper', el).css('width', tmpW + 'px');
				$('.bookable, .bookables', el).css('height', '430px');
				$('.bookables-slide-wrapper', el).slides({container: 'bookables'});
			} else {
				$el.remove();
			}
		});
		
		renderGallery($context);
		
		if (flags.RENDER_DATEPICKERS) {
			renderDatePickers($context);
		}
	};
	return {
		'render': render,
		'renderGallery' : renderGallery
	};
});