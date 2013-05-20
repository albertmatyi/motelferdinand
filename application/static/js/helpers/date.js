/*global define */

define([], function () {
	'use strict';
	var strToDate = function (str) {
		var parts = str.split('-');
		var year = parts[2];
		var month = parts[1] - 1;
		var day = parts[0];
		var date = new Date(year, month, day);
		return date;
	};

	var MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

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
		return (strToDate(date1) - strToDate(date0)) / MILLIS_IN_DAY;
	};
	

	return {
		'toDate': strToDate,
		'toStr': dateToStr,
		'isValid': isValid,
		'getDateDiff': getDateDiff,
		'MILLIS_IN_DAY': MILLIS_IN_DAY,
		'today': strToDate(dateToStr(new Date()))
	};
});