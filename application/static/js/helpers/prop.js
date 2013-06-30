/*global define */
/*global $ */

define(['lib/jquery'], function () {

	var CACHE = {};

	var get = function (key, callback) {
		if (CACHE[key]) {
			callback(CACHE[key]);
		} else {
			$.getJSON('/props/' + key, function (data) {
				CACHE[key] = data.value;
				callback(CACHE[key]);
			});
		}
	};
	return {
		'get': get
	};
});