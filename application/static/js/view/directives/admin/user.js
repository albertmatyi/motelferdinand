/*global define */

define([],
	function () {
		"use strict";
		return {
			'full_name' : {
				text : function (params) {
					return this.user.full_name;
				}
			},
			'email' : {
				text : function (params) {
					return this.user.email;
				}
			},
			'phone' : {
				text : function (params) {
					return this.user.phone;
				}
			}
		};
	}
);