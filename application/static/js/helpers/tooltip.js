/*global define */
/*global $ */

define([],
function () {
	'use strict';
	/**
	 * Shows or hides a tooltip on the given element
	 */
	var setTooltip = function ($item, show) {
		if (show) {
			$item.tooltip({'trigger' : 'manual'});
		}
		$item.tooltip(show ? 'show':'destroy');
	};

	var hideTooltip = function ($item) {
		setTooltip($item, false);
	};

	var showTooltip = function ($item) {
		setTooltip($item, true);
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