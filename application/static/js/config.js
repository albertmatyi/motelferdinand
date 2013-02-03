define([
	'lib/transparency'
], function(transparency){
	transparency.matcher = function(element, key) {
		return element.getAttribute('data-bind') == key;
	};

	window.flags = {
		RENDER_HEADER : true | PRODUCTION,
		RENDER_CONTENT : false | PRODUCTION,
		RENDER_GALLERIES : false | PRODUCTION,
		RENDER_BOOKING : false | PRODUCTION,
		RENDER_BOOKING_GALLERIES : false | PRODUCTION,
		RENDER_DATEPICKERS : false | PRODUCTION
	};
});