/*global define */
/*global $ */
/*global console */

define([
	'lib/jquery',
	'test/util',
	'test/category',
	'test/content'
],
function (jquery, testUtil, category, content) {
	"use strict";
	var TEST_IDX_DEFAULT = -1;
	var testFiles = [category, content];
	var testFileIndex = 0;
	var testIndex = TEST_IDX_DEFAULT;

	var total = 0;
	var success = 0;
	var fail = 0;

	var runNext = function () {
		if (testFileIndex === testFiles.length) {
			console.info('Test results: ' + success + '/' + total + ' succeeded. ' + fail + ' failed.');
			return 0;
		}
		var testFile = testFiles[testFileIndex];
		if (testIndex === TEST_IDX_DEFAULT) {
			testIndex = 0;
			runBeforeTestFile(testFile);
			return;
		}
		if (testIndex === testFile.tests.length) {
			testFileIndex += 1;
			testIndex = TEST_IDX_DEFAULT;
			runAfterTestFile(testFile);
			return;
		}
		var test = testFile.tests[testIndex];

		total += 1;

		runTest(testFile, test);
	};

	var runTest = function (testFile, test) {
		if (testFile.setup) {
			testFile.setup(testUtil);
		}

		for (var key in test) {
			if (test.hasOwnProperty(key)) {
				console.info('Run ' + testFile.name + '.' + key);
				test[key](testUtil);
			}
		}

		if (testFile.teardown) {
			testFile.teardown(testUtil);
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

	var runBeforeTestFile = function (testFile) {
		runMisc(testFile.after, testFile.name + '.before');
	};

	var runAfterTestFile = function (testFile) {
		runMisc(testFile.before, testFile.name + '.after');
	};

	var runMisc = function (method, name) {
		if (method) {
			method(testUtil);
			console.info('Running ' + name);
			testUtil.execute(function () {
				console.info('\tOK');
				runNext();
			},
			function (e) {
				console.warn('\tFAIL: ' + e);
				runNext();
			});
		} else {
			runNext();
		}
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