/*global define */
/*global PRODUCTION */

define([
	'lib/transparency'
], function (transparency) {
	'use strict';
	transparency.matcher = function (element, key) {
		return element.getAttribute('data-bind') === key;
	};

	return {
		RENDER_HEADER : true || PRODUCTION,
		RENDER_CONTENT : true || PRODUCTION,
		RENDER_GALLERIES : false || PRODUCTION,
		RENDER_BOOKING : true || PRODUCTION,
		RENDER_BOOKING_GALLERIES : false || PRODUCTION,
		RENDER_DATEPICKERS : true || PRODUCTION,
		RENDER_TEXTEDITOR : false || PRODUCTION
	};
});