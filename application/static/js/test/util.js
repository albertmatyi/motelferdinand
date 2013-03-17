/*global define */
/*global console */
define(['lib/jquery'], function (jquery) {
	"use strict";
	var testSteps = [];

	var assertEquals = function (expected, actual, message) {
		if (actual !== expected) {
			throw (message || '') + ' | Expected ' + expected + ', got: ' + actual;
		}
	};
	var assertNotEquals = function (expected, actual, message) {
		if (actual === expected) {
			throw (message || '') + ' | Expected something else than: ' + actual;
		}
	};
	var a2S = function (func, timeout) {
		testSteps.push({
			'f' : func,
			'timeout' : timeout || 1
		});
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
		'assertPresent' : function (selector) {
			var at = this.assertTrue;
			a2S(function () {
				at($(selector).length > 0);
			});
			return this;
		},
		'assertTrue' : function (val) {
			a2S(function () {
				assertEquals(true, val);
			});
			return this;
		},
		'assertVisible' : function (el) {
			a2S(function () {
				assertNotEquals('none', el.css('display'),  el + ' should be visible');
				assertEquals('visible', el.css('visibility'), 'The visibility css property of ' + el + 'should be visible');
			});
			return this;
		},
		'click' : function (el) {
			a2S(function () {
				el.click();
			});
			return this;
		},
		'setValue' : function (el, value) {
			a2S(function () {
				if (el[0].tagName.toLowerCase() === 'textarea') {
					el.html(value);
				} else {
					el.val(value);
				}
			});
			return this;
		},
		'wait' : function (timeout) {
			a2S(function () {}, timeout);
			return this;
		},
		'waitXHR' : function () {
			this.wait(2000);
		}
	};
});