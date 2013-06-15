/*global define */
define([],
	function () {
		'use strict';

		var openContactFrom = function (t, btn) {
			t.l('Click on ' + btn + ' icon').click('.social ' + btn);

			t.l('Verify popup visible').assertVisible('#contactModal');

			t.l('Click close').click('#contactModal .modal-footer .btn').assertInvisible('#contactModal');
		};

		var testPhone = function (t) {
			openContactFrom(t, '.phone');
		};

		var testMap = function (t) {
			openContactFrom(t, '.map');
		};

		var testMail = function (t) {
			openContactFrom(t, '.mail');
		};

		return {
			'name' : 'Social',
			'tests' : [
				{ 'testPhone' : testPhone },
				{ 'testMail' : testMail },
				{ 'testMap' : testMap }
			]
		};
	}
);