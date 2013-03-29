/*global define */
define(
[
],
function () {
	return function (bookableTitleStr) {
		return {
			'selector' : '.booking-entries tbody tr:contains(' + bookableTitleStr + ')'
		};
	};
});