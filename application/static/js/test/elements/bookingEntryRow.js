/*global define */
define(
[
],
function () {
	return function (bookableTitleStr) {
		"use strict";
		var SELECTOR = '.booking-entries tbody tr:contains(' + bookableTitleStr + ')';
		return {
			'selector' : SELECTOR,
			'removeButton' : SELECTOR + ' .btn-danger'
		};
	};
});