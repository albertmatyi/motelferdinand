/*global define */
/*global $ */
/*global console */
/*global _ */
/*global confirm */
/*global window */

define([
	'lib/jquery',
	'test/util'
],
function (jquery, testUtil) {
	'use strict';
	var TEST_IDX_DEFAULT = -1;
	var testFiles = [];
	var testFileIndex = 0;
	var testIndex = TEST_IDX_DEFAULT;

	var total = 0;
	var success = 0;
	var fail = 0;

	var testFileFilter = false;
	var testFilter = false;

	var testFileTime;
	var totalTime;

	var runNext = function () {
		if (testFileIndex >= testFiles.length) {
			totalTime = $.now() - totalTime;
			console.info('Test results: ' + success + '/' + total + ' succeeded. ' + fail + ' failed in ' + getTime(totalTime));
			return 0;
		}
		var testFile = testFiles[testFileIndex];

		if (testFileFilter && !_.any(testFileFilter, filterMatches(testFile.name))) {
			console.log(testFile.name + ' filtered out by ' + testFileFilter);
			testFileIndex += 1;
			setTimeout(runNext, 1);
			return;
		}

		if (testIndex === TEST_IDX_DEFAULT) {
			runBeforeTestFile(testFile);
			return;
		}
		if (testIndex >= testFile.tests.length) {
			runAfterTestFile(testFile);
			return;
		}
		var test = testFile.tests[testIndex];

		filterAndRunTest(testFile, test);
	};

	var filterMatches = function (value) {
		return function (filter) {
			var match = value.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
			return match;
		};
	};

	var getTestKey = function (test) {
		for (var key in test) {
			if (test.hasOwnProperty(key)) {
				return key;
			}
		}
	};

	var getTime = function (millis) {
		var seconds = Math.round(millis / 100) / 10;
		var minutes = Math.round(seconds / 60);
		return minutes + 'm ' + (seconds % 60) + 's';
	};

	var runTest = function (testFile, test, key) {
		var testTime = $.now();
		if (testFile.setup) {
			testFile.setup(testUtil);
		}
		console.info('Run ' + testFile.name + '.' + key);

		test[key](testUtil);

		if (testFile.teardown) {
			testFile.teardown(testUtil);
		}

		testUtil.execute(function () {
			console.info('\tOK[' + getTime($.now() - testTime) + ']');

			total += 1;
			success += 1;
			testIndex += 1;
			setTimeout(runNext, 1);
		}, function (e) {
			console.warn('\tFAIL[' + getTime($.now() - testTime) + ']' + e);

			total += 1;
			fail += 1;
			testIndex += 1;
			if (!window.config.test.breakOnError || confirm('Test ' + key + ' failed. Do you want to continue?')) {
				setTimeout(runNext, 1);
			}
		});
	};

	var filterAndRunTest = function (testFile, test) {
		var key = getTestKey(test);
		if (!testFilter || _.any(testFilter, filterMatches(key))) {
			runTest(testFile, test, key);
		} else {
			console.log('\t' + key + ' filtered out by ' + testFilter);
			testIndex += 1;
			setTimeout(runNext, 1);
		}
	};

	var runBeforeTestFile = function (testFile) {
		testIndex = 0;
		testFileTime = $.now();
		runMisc(testFile.before, testFile.name + '.before', function () {}, function () {
			testIndex = TEST_IDX_DEFAULT;
			testFileIndex += 1;
		});
	};

	var runAfterTestFile = function (testFile) {
		testFileIndex += 1;
		testIndex = TEST_IDX_DEFAULT;
		var logTime = function () {
			console.log(testFile.name + ' OK[' + getTime($.now() - testFileTime) + ']');
		};
		runMisc(testFile.after, testFile.name + '.after', logTime, logTime);
	};

	var runMisc = function (method, name, successCallback, failCallback) {
		if (method) {
			method(testUtil);
			console.info('Running ' + name);
			testUtil.execute(function () {
				console.info('\tOK');
				setTimeout(runNext, 1);
				if (typeof successCallback !== 'undefined') {
					successCallback();
				}
			},
			function (e) {
				console.warn('\tFAIL: ' + e);
				setTimeout(runNext, 1);
				if (typeof failCallback !== 'undefined') {
					failCallback();
				}
			});
		} else {
			setTimeout(runNext, 1);
			if (typeof successCallback !== 'undefined') {
				successCallback();
			}
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
		console.clear();
		initFilters(tff, tf);
		console.clear();
		total = 0;
		success = 0;
		fail = 0;
		testFileIndex = 0;
		totalTime = $.now();
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

	$(window).keyup(function (e) {
		if (e.which === 27) {
			testUtil.fail('Test cancelled by user.');
		}
	});

	$('#testButton').click(runTests);
	return {
		'tests': testFiles
	};
});