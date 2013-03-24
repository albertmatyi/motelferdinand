/*global define */
/*global console */
/*global _ */

define(['lib/jquery'], function (jquery) {
	"use strict";
	var testSteps = [];
	var executing = false;
	var stepInsertIndex = 0;

	$(document).ajaxError(function () {
		a2S(function () {
			throwException('XHR call failed. Stopping execution');
		}, 'xhrFailed', 1, true);
	});

	var throwException = function (msg) {
		dumpSteps();
		testSteps = [];
		executing = false;
		console.warn('\t' + msg);
		throw new Error(msg);
	};

	var dumpSteps = function () {
		var str = _.reduce(testSteps, function (s, step) {
			return s += ', ' + step.description;
		}, '');
		log('Test steps: [' + str + ']');
	};

	var assertEquals = function (expected, actual, message) {
		if (actual !== expected) {
			var msg = (message || '') + ' | Expected ' + expected + ', got: ' + actual;
			throwException(msg);
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

	var waitUntilVisible = function (jqEl, msg, callback) {
		waitUntilVisibility(jqEl, true, msg, callback);
	};

	var waitUntilHidden = function (jqEl, msg, callback) {
		waitUntilVisibility(jqEl, false, msg, callback);
	};

	var waitUntilVisibility = function (jqEl, visible, msg, callback) {
		msg = msg || jqEl.selector + ' should be visible.';
		var maxRetries = window.config.test.visibility.maxRetries;
		var wuv = function () {
			if (visible !== jqEl.is(':visible')) {
				if (maxRetries > 0) {
					maxRetries -= 1;
					log('Waiting for element ' + jqEl.selector + ' to become ' + (visible ? '':'in') + 'visible');
					a2S(wuv, 'wuv', window.config.test.visibility.timeout, true);
				} else {
					throwException(msg);
				}
			} else {
				if (callback) {
					callback();
				}
			}
		};
		wuv();
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
				waitUntilVisible(jqEl);
			}, 'aV');
			return this;
		},
		'assertInvisible' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilHidden(jqEl);
			}, 'aI');
			return this;
		},
		'click' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilVisible(jqEl, 'Cannot click on invisible ' + selector, function () {
					jqEl.click();
				});
			}, 'c');
			return this;
		},
		'setValue' : function (selector, value) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilVisible(jqEl, 'Cannot set value of an invisible ' + selector, function () {
					if (jqEl[0].tagName.toLowerCase() === 'textarea') {
						jqEl.html(value);
					} else {
						jqEl.val(value);
					}
				});
			}, 'sV');
			return this;
		},
		'waitAnimation' : function () {
			a2S(function () {}, 'wA', window.config.test.timeouts.animation);
			return this;
		},
		'waitXHR' : function () {
			var maxRetries = window.config.test.xhr.maxRetries;
			var lwx = function (wxp, forceAs1st) {
				a2S(function () {
					if ($.active > 0) {
						log('Waiting for XHR...');
						if (maxRetries > 0) {
							maxRetries -= 1;
							lwx(wxp, true);
						} else {
							throwException('Response timed out. Maximum number of XHR retries' +
								window.config.test.xhr.maxRetries + ' reached.');
						}
					} else {
						a2S(function () {
							log('XHR finished.');
							//let the application respond
							// that's why the timeout
						}, 'wXE', window.config.test.xhr.after, true);
					}
				}, 'wX', window.config.test.xhr.timeout, forceAs1st);
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