/*global define */

define([],
	function () {
		'use strict';
		return {
			'full_name' : {
				text : function () {
					return this.user.full_name;
				}
			},
			'email' : {
				text : function () {
					return this.user.email;
				}
			},
			'phone' : {
				text : function () {
					return this.user.phone;
				}
			},
			'language' : {
				text : function () {
					return this.user.language;
				}
			},
			'citizenship' : {
				text : function () {
					return this.user.citizenship;
				}
			}
		};
	}
);