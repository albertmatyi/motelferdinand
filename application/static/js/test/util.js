/*global define */
/*global console */
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
	var a2S = function (func, timeout) {
		var step = {
			'f' : func,
			'timeout' : timeout || 1
		};
		if (executing) {
			// Inserts steps during execution, at the right place.
			testSteps.splice(stepInsertIndex, 0, step);
			stepInsertIndex += 1;
		} else {
			// Normal instertion of test steps 
			testSteps.push(step);
		}
	};

	var execute = function (successCB, failCB) {
		executing = true;
		try {
			if (testSteps.length !== 0) {
				var step = testSteps.shift();
				stepInsertIndex = stepInsertIndex > 0 ? stepInsertIndex - 1 : 0;
				step.f();
				setTimeout(function () {
					execute(successCB, failCB);
				}, step.timeout, this);
			} else {
				executing = false;
				stepInsertIndex = 0;
				successCB();
			}
		} catch (e) {
			testSteps = [];
			executing = false;
			stepInsertIndex = 0;
			failCB(e);
		}
	};
	return {
		'execute' : execute,
		'l' : function (msg) {
			a2S(function () {
				console.log('\t\t' + msg);
			});
			return this;
		},
		'assertEquals' : function (expected, actual, message) {
			a2S(function () {
				assertEquals(expected, actual, message);
			});
		},
		'assertCount' : function (expectedCount, selector) {
			a2S(function () {
				assertEquals(expectedCount, $(selector).length, 'The number of ' + selector + ' doesn\'t match.');
			});
		},
		'assertNotPresent' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(0, jqEl.length, jqEl.selector + " should not be present.");
			});
			return this;
		},
		'assertPresent' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(true, jqEl.length > 0, jqEl.selector + " cannot be found.");
			});
			return this;
		},
		'assertTrue' : function (val, msg) {
			a2S(function () {
				assertEquals(true, val, msg);
			});
			return this;
		},
		'assertVisible' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(true, jqEl.is(':visible'), selector + ' should be visible.');
			});
			return this;
		},
		'click' : function (selector) {
			a2S(function () {
				$(selector).click();
			});
			return this;
		},
		'setValue' : function (selector, value) {
			a2S(function () {
				var jqEl = $(selector);
				if (jqEl[0].tagName.toLowerCase() === 'textarea') {
					jqEl.html(value);
				} else {
					jqEl.val(value);
				}
			});
			return this;
		},
		'wait' : function (timeout) {
			a2S(function () {}, timeout);
			return this;
		},
		'waitXHR' : function () {
			return this.wait(2000);
		},
		'addFunction' : function (method, timeout) {
			a2S(method, timeout);
			return this;
		},
		'$' : function (selector, callback) {
			a2S( function () {
				callback($(selector));
			});
			return this;
		}
	};
});