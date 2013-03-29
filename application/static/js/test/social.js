/*global define */
define(['test/elements/dialog'],
	function (dialog) {
		"use strict";
		var testPhone = function (t) {
			t.l('Click on phone icon').click('.social-icons .phone');

			t.l('Verify popup visible').assertVisible('#phoneModal');

			t.l('Click close').click('#phoneModal .modal-footer .btn').assertInvisible('#phoneModal');
		};

		var testMap = function (t) {
			t.l('Click on map icon').click('.social-icons .map');

			t.l('Verify popup visible').assertVisible('#mapModal iframe');

			t.l('Click close').click('#mapModal .modal-footer .btn').assertInvisible('#mapModal');
		};

		var testMail = function (t) {
			t.l('Click on mail icon').click('.social-icons .mail');

			t.l('Verify popup visible').assertVisible(dialog.selector);

			t.$(dialog.selector, function (dm) {
				t.assertTrue(/\w+@[^\s]+\.\w+/.exec(dm.text()).length > 0, 'Popup should contain an email address');
			});

			t.l('Click close').click(dialog.alert.ok).assertInvisible(dialog.selector);
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