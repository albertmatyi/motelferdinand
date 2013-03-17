/*global define */
/*global PRODUCTION */
/*global window */

define([
	'lib/transparency'
], function (transparency) {
	"use strict";
	transparency.matcher = function (element, key) {
		return element.getAttribute('data-bind') === key;
	};

	window.flags = {
		RENDER_HEADER : true || PRODUCTION,
		RENDER_CONTENT : true || PRODUCTION,
		RENDER_GALLERIES : false|| PRODUCTION,
		RENDER_BOOKING : true || PRODUCTION,
		RENDER_BOOKING_GALLERIES : false|| PRODUCTION,
		RENDER_DATEPICKERS : true || PRODUCTION
	};
});