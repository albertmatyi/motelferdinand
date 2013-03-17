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
	return {
		'execute' : function (successCB, failCB) {
			try {
				if (testSteps.length !== 0) {
					step = testSteps.shift();
					step.f();
					setTimeout(function() {
						this.execute(successCB, failCB);
					}, step.timeout);
				} else {
					successCB();
				}
			} catch (e) {
				testSteps = []
				failCB(e);
			}
		},
		'l' : function (msg) {
			a2S(console.log('\t\t' + msg);
			return this;
		},
		'assertTrue' : function (val) {
			assertEquals(true, val);
			return this;
		},
		'assertVisible' : function (el, timeout, nextFunction) {
			timeout = timeout || 0;
			function () {
				assertNotEquals('none', el.css('display'),  el + ' should be visible');
				assertEquals('visible', el.css('visibility'), 'The visibility css property of ' + el + 'should be visible');
				if (nextFunction) {
					nextFunction();
				}
			};
			return this;
		},
		'setValue' : function (el, value) {
			if (el[0].tagName.toLowerCase() === 'textarea') {
				el.html(value);
			} else {
				el.val(value);
			}
			return this;
		}
	};
});