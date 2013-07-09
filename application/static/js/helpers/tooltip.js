/*global define */
/*global $ */

define(['lib/jquery'],
function () {
	'use strict';

	var defaultOptions = {
		'trigger' : 'manual'
	};

	/**
	 * Shows or hides a tooltip on the given element
	 */
	var setTooltip = function ($item, show, options) {
		options = $.extend({}, defaultOptions, options);
		if (show) {
			$item.tooltip(options);
		}
		$item.tooltip(show ? 'show':'destroy');
	};

	var hideTooltip = function ($item, options) {
		setTooltip($item, false, options);
	};

	var showTooltip = function ($item, options) {
		setTooltip($item, true, options);
	};

	var hideAll = function ($context) {
		$('*[rel="tooltip"]', $context).each(function (i, el) {
			hideTooltip($(el));
		});
	};

	return {
		'set': setTooltip,
		'hide': hideTooltip,
		'show': showTooltip,
		'hideAll': hideAll
	};
});