/*global define */

define(
	[
		'test/integration',
		'test/category',
		'test/content',
		'test/bookable'
	], function (integration) {
		"use strict";
		window.config.test.breakOnError = true;
		for (var i = 1; i < arguments.length; i++) {
			integration.tests.push(arguments[i]);
		}
	}
);