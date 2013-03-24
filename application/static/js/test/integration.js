/*global define */
/*global $ */
/*global console */
/*global _ */

define([
	'lib/jquery',
	'test/util'
],
function (jquery, testUtil) {
	"use strict";
	var TEST_IDX_DEFAULT = -1;
	var testFiles = [];
	var testFileIndex = 0;
	var testIndex = TEST_IDX_DEFAULT;

	var total = 0;
	var success = 0;
	var fail = 0;

	var testFileFilter = false;
	var testFilter = false;

	var runNext = function () {
		if (testFileIndex >= testFiles.length) {
			console.info('Test results: ' + success + '/' + total + ' succeeded. ' + fail + ' failed.');
			return 0;
		}
		var testFile = testFiles[testFileIndex];

		if (testFileFilter && !_.contains(testFileFilter, testFile.name)) {
			console.log(testFile.name + ' filtered out by ' + testFileFilter);
			testFileIndex += 1;
			setTimeout(runNext, 1);
			return;
		}

		if (testIndex === TEST_IDX_DEFAULT) {
			testIndex = 0;
			runBeforeTestFile(testFile);
			return;
		}
		if (testIndex >= testFile.tests.length) {
			testFileIndex += 1;
			testIndex = TEST_IDX_DEFAULT;
			runAfterTestFile(testFile);
			return;
		}
		var test = testFile.tests[testIndex];

		runTest(testFile, test);
	};

	var runTest = function (testFile, test) {
		var filtered = false;
		for (var key in test) {
			if (test.hasOwnProperty(key)) {
				if (!testFilter || _.contains(testFilter, key)) {
					if (testFile.setup) {
						testFile.setup(testUtil);
					}
					console.info('Run ' + testFile.name + '.' + key);
					test[key](testUtil);
					if (testFile.teardown) {
						testFile.teardown(testUtil);
					}
				} else {
					filtered = true;
					console.log('\t' + key + ' filtered out by ' + testFilter);
				}
			}
		}
		if (!filtered) {
			testUtil.execute(function () {
				console.info('\tOK');
				total += 1;
				success += 1;
				testIndex += 1;
				setTimeout(runNext, 1);
			}, function (e) {
				console.warn('\tFAIL: ' + e);
				total += 1;
				fail += 1;
				testIndex += 1;
				if (!window.config.test.breakOnError) {
					setTimeout(runNext, 1);
				}
			});
		} else {
			testIndex += 1;
			setTimeout(runNext, 1);
		}
	};

	var runBeforeTestFile = function (testFile) {
		runMisc(testFile.before, testFile.name + '.before');
	};

	var runAfterTestFile = function (testFile) {
		runMisc(testFile.after, testFile.name + '.after');
	};

	var runMisc = function (method, name) {
		if (method) {
			method(testUtil);
			console.info('Running ' + name);
			testUtil.execute(function () {
				console.info('\tOK');
				setTimeout(runNext, 1);
			},
			function (e) {
				console.warn('\tFAIL: ' + e);
				setTimeout(runNext, 1);
			});
		} else {
			setTimeout(runNext, 1);
		}
	};

	var initFilters = function (tff, tf) {
		switch (typeof tff) {
		case 'string':
			testFileFilter = [tff];
			break;
		case 'object':
			testFileFilter = tff;
			break;
		default:
			testFileFilter = false;
			break;
		}
		switch (typeof tf) {
		case 'string' :
			testFilter = [tf];
			break;
		case 'object' :
			testFilter = tf;
			break;
		default :
			testFilter = false;
			break;
		}
	};

	var runTests = function (tff, tf) {
		initFilters(tff, tf);
		console.clear();
		total = 0;
		success = 0;
		fail = 0;
		testFileIndex = 0;
		testIndex = TEST_IDX_DEFAULT;

		setTimeout(runNext, 1);
		return 'Started tests';
	};

	window.config = {
		'test' : {
			'breakOnError' : false,
			'xhr' : {
				'maxRetries' : 50, // the 
				'timeout' : 200, // the timeout between two "XHR is finished" checks
				'after' : 200 // the ammount of time the app is let to respond after an XHR call
			},
			'timeouts' : {
				'animation' : 500 // the time a waitAnimation() should wait for
			},
			'visibility' : {
				'timeout' : 100,
				'maxRetries' : 20
			},
			'debug' : false
		}
	};
	window.test = runTests;
	$('#testButton').click(runTests);
	return {
		'tests': testFiles
	};
});