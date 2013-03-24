/*global define */
/*global console */
/*global _ */

define(['lib/jquery'], function (jquery) {
	"use strict";
	var testSteps = [];
	var executing = false;
	var stepInsertIndex = 0;

	var assertEquals = function (expected, actual, message) {
		if (actual !== expected) {
			var msg = (message || '') + ' | Expected ' + expected + ', got: ' + actual;
			console.warn('\t' + msg);
			throw new Error(msg);
		}
	};
	var a2S = function (func, description, timeout, forceAs1st) {
		var step = {
			'f' : func,
			'timeout' : timeout || 1,
			'description' : description
		};

		if (executing) {
			// Inserts steps during execution, at the right place.
			testSteps.splice(forceAs1st ? 0:stepInsertIndex, 0, step);
			stepInsertIndex += 1;
		} else {
			// Normal instertion of test steps 
			testSteps.push(step);
		}
		if (window.config.test.debug) {
			var str = _.reduce(testSteps, function (s, step) {
				return s += ', ' + step.description;
			}, '');
			console.log('DEBUG: [' + str + ']');
		}
	};

	var execute = function (successCB, failCB) {
		executing = true;
		stepInsertIndex = 0;
		try {
			if (testSteps.length !== 0) {
				var step = testSteps.shift();
				step.f();
				setTimeout(function () {
					execute(successCB, failCB);
				}, step.timeout, this);
			} else {
				executing = false;
				successCB();
			}
		} catch (e) {
			testSteps = [];
			executing = false;
			failCB(e);
		}
	};

	var log = function (msg) {
		console.log('\t\t' + msg);
	};

	return {
		'execute' : execute,
		'l' : function (msg) {
			a2S(function () {
				log(msg);
			}, '_');
			return this;
		},
		'assertEquals' : function (expected, actual, message) {
			a2S(function () {
				assertEquals(expected, actual, message);
			}, 'aE');
		},
		'assertCount' : function (expectedCount, selector) {
			a2S(function () {
				assertEquals(expectedCount, $(selector).length, 'The number of ' + selector + ' doesn\'t match.');
			}, 'aC');
		},
		'assertNotPresent' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(0, jqEl.length, jqEl.selector + " should not be present.");
			}, 'aNP');
			return this;
		},
		'assertPresent' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(true, jqEl.length > 0, jqEl.selector + " cannot be found.");
			}, 'aP');
			return this;
		},
		'assertTrue' : function (val, msg) {
			a2S(function () {
				assertEquals(true, val, msg);
			}, 'aT');
			return this;
		},
		'assertVisible' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(true, jqEl.is(':visible'), selector + ' should be visible.');
			}, 'aV');
			return this;
		},
		'click' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(true, jqEl.is(':visible'), 'Cannot click on invisible ' + selector);
				jqEl.click();
			}, 'c');
			return this;
		},
		'setValue' : function (selector, value) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(true, jqEl.is(':visible'), 'Cannot set value of an invisible ' + selector);
				if (jqEl[0].tagName.toLowerCase() === 'textarea') {
					jqEl.html(value);
				} else {
					jqEl.val(value);
				}
			}, 'sV');
			return this;
		},
		'waitAnimation' : function () {
			a2S(function () {}, 'wA', window.config.test.timeouts.animation);
			return this;
		},
		'waitXHR' : function () {
			var lwx = function (wx, forceAs1st) {
				a2S(function () {
					if ($.active > 0) {
						log('Waiting for XHR...');
						lwx(wx, true);
					} else {
						a2S(function () {
							log('XHR finished.');
							//let the application respond
							// that's why the timeout
						}, 'wXE', window.config.test.timeouts.XHRafter, true);
					}
				}, 'wX', window.config.test.timeouts.XHRcheck, forceAs1st);
			};
			lwx(this.waitXHR, false);
			return this;
		},
		'addFunction' : function (method, timeout) {
			a2S(method, 'aF', timeout);
			return this;
		},
		'$' : function (selector, callback, context) {
			a2S(function () {
				callback($(selector, context));
			}, '$');
			return this;
		}
	};
});