define([
	'lib/transparency'
], function(transparency){
	transparency.matcher = function(element, key) {
		return element.getAttribute('data-bind') == key;
	};

	window.flags = {
		RENDER_HEADER : true | PRODUCTION,
		RENDER_CONTENT : true | PRODUCTION,
		RENDER_GALLERIES : true | PRODUCTION,
		RENDER_BOOKING : true | PRODUCTION,
		RENDER_BOOKING_GALLERIES : true | PRODUCTION,
		RENDER_DATEPICKERS : true | PRODUCTION
	};
});