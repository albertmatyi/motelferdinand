/*global define */

define([], function () {
	'use strict';
	var MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
	var strToDate = function (str) {
		var parts = str.split('-');
		var year = parts[2];
		var month = parts[1] - 1;
		var day = parts[0];
		var date = new Date(year, month, day);
		return date;
	};


	var completeWith0 = function (val) {
		return val < 10 ? '0' + val : val;
	};

	var dateToStr = function (date) {
		var str = completeWith0(date.getDate()) +
			'-' + completeWith0(date.getMonth() + 1) +
			'-' + date.getFullYear();
		return str;
	};

	var isValid = function (str) {
		return (/^\d{2}-\d{2}-\d{4}$/).exec(str) !== null;
	};

	var getDateDiff = function (date0, date1) {
		// have to round to avoid DST problems
		return Math.round((strToDate(date1) - strToDate(date0)) / MILLIS_IN_DAY);
	};

	var previousDay = function (date) {
		return new Date(date.getTime() - MILLIS_IN_DAY);
	};

	var nextDay = function (date, days) {
		days = days || 1;
		return new Date(date.getTime() + MILLIS_IN_DAY * days);
	};

	var stripTime = function (date) {
		return strToDate(dateToStr(date));
	};

	var getDateForType = function (timeInMillis, type) {
		switch (type) {
		case 'int':
		case 'number':
			return timeInMillis;
		case 'str':
		case 'string':
			return dateToStr(new Date(timeInMillis));
		case 'date':
			return new Date(timeInMillis);
		}
	};

	var someDateToMillis = function (someDate) {
		var typ = typeof someDate;
		if (['int', 'number'].indexOf(typ) !== -1) {
			typ = 'object';
			someDate = new Date(someDate);
		}
		if (typ === 'object') {
			someDate = dateToStr(someDate);
			typ = 'string';
		}
		if (typ === 'string') {
			return strToDate(someDate).getTime();
		} else {
			throw 'Cannot convert "' + someDate + '" into millis';
		}
	};

	var iterateBetweenDates = function (startD, endD, returnType, callback, inclusive) {
		inclusive = inclusive ? true:false;
		var start = someDateToMillis(startD);
		var end = someDateToMillis(endD);
		for (var i = start; (inclusive ? i <= end:i < end); i += MILLIS_IN_DAY) {
			var date = getDateForType(i, returnType);
			var rv = callback(date);
			if (rv === false) {
				break;
			}
		}
	};

	var getDayOfYear = function (date) {
		var yearStart = new Date(date.getFullYear(), 0);
		var diff = date - yearStart;
		return diff / MILLIS_IN_DAY;
	};

	var isValidRange = function (start, end) {
		try {
			start = someDateToMillis(start);
			end = someDateToMillis(end);
			return start < end;
		} catch (end) {
			return false;
		}
	};

	var TODAY = stripTime(new Date());

	return {
		'toDate': strToDate,
		'toStr': dateToStr,
		'isValid': isValid,
		'isValidRange': isValidRange,
		'getDateDiff': getDateDiff,
		'today': TODAY,
		'previousDay': previousDay,
		'nextDay': nextDay,
		'yesterday': new Date(TODAY.getTime() - MILLIS_IN_DAY),
		'stripTime': stripTime,
		'iterateBetweenDates': iterateBetweenDates,
		'getDayOfYear': getDayOfYear
	};
});