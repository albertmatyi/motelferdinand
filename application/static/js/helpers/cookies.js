/*global define */
/*global escape */
/*global document */

define(
{
	'set' : function (name, value, exdays) {
		'use strict';
		if (!exdays) {
			exdays = 30;
		}
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var tval = escape(value) + ((exdays === null) ? '' : '; expires=' + exdate.toUTCString());
		document.cookie = name + '=' + tval;
	}
});