/*global define */
/*global console */
define(['lib/jquery'], function (jquery) {
	"use strict";
	var testSteps = [];

	var assertEquals = function (expected, actual, message) {
		if (actual !== expected) {
			var msg = (message || '') + ' | Expected ' + expected + ', got: ' + actual;
			console.warn('\t'+msg);
			throw new Error(msg);
		}
	};
	var assertNotEquals = function (expected, actual, message) {
		if (actual === expected) {
			var msg = (message || '') + ' | Expected something else than: ' + actual;
			console.warn('\t'+msg);
			throw new Error(msg);
		}
	};
	var a2S = function (func, timeout) {
		testSteps.push({
			'f' : func,
			'timeout' : timeout || 1
		});
	};

	var assertNotUndef = function (val, descr) {
		if (typeof val === 'undefined') {
			var msg = '';
			if (descr) {
				msg = '\tArg for ' + descr + ' is undefined';
			} else {
				msg = '\tUndefined variable';
			}
			console.warn('\t'+msg);
			throw new Error(msg);
		}
	};

	var execute = function (successCB, failCB) {
		try {
			if (testSteps.length !== 0) {
				var step = testSteps.shift();
				step.f();
				setTimeout(function () {
					execute(successCB, failCB);
				}, step.timeout, this);
			} else {
				successCB();
			}
		} catch (e) {
			testSteps = [];
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
				assertEquals(true, jqEl.length > 0, selector + " cannot be found.");
				assertNotEquals('none', jqEl.css('display'),  jqEl + ' should be visible');
				assertEquals('visible', jqEl.css('visibility'), 'The visibility css property of ' + jqEl + 'should be visible');
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
		}
	};
});