/*global define */
/*global window */

define(
	[
		'test/integration',
		'test/category',
		'test/content',
		'test/bookable',
		'test/booking',
		'test/social'
	], function (integration) {
		'use strict';
		window.config.test.breakOnError = true;
		// window.config.test.debug = true;
		for (var i = 1; i < arguments.length; i += 1) {
			integration.tests.push(arguments[i]);
		}
	}
);