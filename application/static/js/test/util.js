/*global define */
/*global console */
/*global _ */
/*global $ */
/*global document */
/*global window */

define(['lib/jquery'], function (jq) {
	'use strict';
	var testSteps = [];
	var executing = false;
	var stepInsertIndex = 0;

	var fail = function (msg) {
		a2S(function () {
			throwException(msg);
		}, 'fail', 1, true);
	};

	$(document).ajaxError(function () {
		fail('XHR call failed. Stopping execution');
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

	var assertPresentPvt = function (jqEl) {
		assertEquals(true, jqEl.length > 0, jqEl.selector + ' cannot be found.');
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
				log('\t' + step.description);
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

	var waitUntilVisible = function (jqEl, actionDescr, callback) {
		var msg = actionDescr ? 'Cannot perform ' + actionDescr:null;
		waitUntilVisibility(jqEl, true, msg, callback);
	};

	var waitUntilHidden = function (jqEl, msg, callback) {
		waitUntilVisibility(jqEl, false, msg, callback);
	};

	var waitUntilVisibility = function (jqEl, visible, msg, callback) {
		msg = msg || jqEl.selector + ' should be ' + (visible ? '':'in') + 'visible.';
		var maxRetries = window.config.test.visibility.maxRetries;
		var wuv = function () {
			if (visible !== jqEl.is(':visible')) {
				if (maxRetries > 0) {
					maxRetries -= 1;
					log('Waiting for element ' + jqEl.selector + ' to become ' + (visible ? '':'in') + 'visible.');
					a2S(wuv, 'Wait until visible: ' + jqEl.selector, window.config.test.visibility.timeout, true);
				} else {
					if (jqEl.length > 0) {
						msg += ' Element "' + jqEl.selector + '" is ' + (visible ? 'in':'') + 'visible.';
					} else {
						msg += ' Element "' + jqEl.selector + '" does not exist.';
					}
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
			}, 'Log: ' + msg);
			return this;
		},
		'assertEquals' : function (expected, actual, message) {
			a2S(function () {
				assertEquals(expected, actual, message);
			}, 'Assert equals: ' + expected + ' == ' + actual + ' msg: ' + message);
		},
		'assertCount' : function (expectedCount, selector) {
			a2S(function () {
				assertEquals(expectedCount, $(selector).length, 'The number of ' + selector + ' doesn\'t match.');
			}, 'Assert count of ' + selector + ' is ' + expectedCount);
		},
		'assertNotPresent' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				assertEquals(0, jqEl.length, jqEl.selector + ' should not be present.');
			}, 'Assert not present: ' + selector);
			return this;
		},
		'assertPresent' : function (selector, context) {
			a2S(function () {
				var jqEl = $(selector, context);
				assertPresentPvt(jqEl);
			}, 'Assert present: ' + selector);
			return this;
		},
		'assertTrue' : function (val, msg) {
			a2S(function () {
				assertEquals(true, val, msg);
			}, 'Assert true: ' + val + ' msg: ' + msg);
			return this;
		},
		'assertVisible' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilVisible(jqEl);
			}, 'Assert visible: ' + selector);
			return this;
		},
		'assertInvisible' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilHidden(jqEl);
			}, 'Assert invisible: ' + selector);
			return this;
		},
		'click' : function (selector) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilVisible(jqEl, 'click', function () {
					jqEl.click();
				});
			}, 'Click on: ' + selector);
			return this;
		},
		'setValue' : function (selector, value) {
			a2S(function () {
				var jqEl = $(selector);
				waitUntilVisible(jqEl, 'set value', function () {
					if (jqEl[0].tagName.toLowerCase() === 'textarea') {
						jqEl.html(value);
					} else {
						jqEl.val(value);
					}
					jqEl.trigger('change');
				});
			}, 'Set value: ' + value + ' to: ' + selector);
			return this;
		},
		'waitAnimation' : function () {
			a2S(function () {}, 'Wait for animation', window.config.test.timeouts.animation);
			return this;
		},
		'wait' : function (timeout) {
			timeout = timeout || 500;
			a2S(function () {}, 'Wait for ' + timeout + 'ms', timeout);
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
						}, 'Xhr finished', window.config.test.xhr.after, true);
					}
				}, 'Wait xhr', window.config.test.xhr.timeout, forceAs1st);
			};
			lwx(this.waitXHR, false);
			return this;
		},
		'fail' : fail,
		'addFunction' : function (method, timeout) {
			a2S(method, 'Add method', timeout);
			return this;
		},
		'$' : function (selector, callback, context) {
			a2S(function () {
				var $el = $(selector, context);
				assertPresentPvt($el);
				callback($el);
			}, 'LateQuery $:' + selector);
			return this;
		},
		'hash' : function () {
			var nr = $.now();
			return String.fromCharCode(97 + nr % 26) +
				String.fromCharCode(97 + (nr / 26) % 26) +
				String.fromCharCode(97 + (nr / (26 * 26)) % 26);
		}
	};
});