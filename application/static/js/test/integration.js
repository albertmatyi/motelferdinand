/*global define */
/*global $ */
/*global console */

define([
	'lib/jquery',
	'test/category',
	'test/util'
],
function (jquery, category, testUtil) {
	"use strict";

	var testFiles = [category];
	var testFileIndex = 0;
	var testIndex = 0;

	var total = 0;
	var success = 0;
	var fail = 0;

	var runNext = function () {
		if (testFileIndex === testFiles.length) {
			console.info('Test results: ' + success + '/' + total + ' succeeded. ' + fail + ' failed.');
			return 0;
		}
		var testFile = testFiles[testFileIndex];
		if (testIndex === testFile.tests.length) {
			testFileIndex += 1;
			return runNext();
		}
		var test = testFile.tests[testIndex];

		total += 1;

		if (testFile.setup) {
			testFile.setup(testUtil);
		}

		for (var key in test) {
			if (test.hasOwnProperty(key) && key !== 'setup') {
				console.info('Run ' + key);
				test[key](testUtil);
			}
		}

		testUtil.execute(function () {
			console.info('\tOK');
			success += 1;
			testIndex += 1;
			runNext();
		}, function (e) {
			console.warn('\tFAIL: ' + e);
			fail += 1;
			testIndex += 1;
			runNext();
		});
	};

	var runTests = function () {
		console.clear();
		total = 0;
		success = 0;
		fail = 0;
		testFileIndex = 0;
		testIndex = 0;

		runNext();
	};

	$('#testButton').click(runTests);
	window.test = runTests;
});