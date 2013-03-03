/*global define */
/*global escape */

define(
{
	'set' : function (c_name, value, exdays) {
		"use strict";
		if (!exdays) {
			exdays = 30;
		}
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
		document.cookie = c_name + "=" + c_value;
	}
});