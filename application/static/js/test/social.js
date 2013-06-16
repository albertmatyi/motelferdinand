/*global define */
define([],
	function () {
		'use strict';

		var openContactFrom = function (t, btn) {
			t.l('Click on ' + btn + ' icon').click('.social ' + btn);

			t.l('Verify popup visible').assertVisible('#contactModal');

			t.l('Click close').click('#contactModal .modal-footer .btn').assertInvisible('#contactModal');
		};

		var testContact = function (t) {
			openContactFrom(t, '.group');
		};

		return {
			'name' : 'Social',
			'tests' : [
				{ 'testContact' : testContact }
			]
		};
	}
);