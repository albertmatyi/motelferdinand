/*global define */
/*global $ */

define(
[
	'controllers/booking',
	'helpers/fixit'
],
function (booking, fixit) {
	"use strict";
	return {
		init : function () {
			fixit.setup($('.category-info'));
			booking.setup();
		}
	};
});