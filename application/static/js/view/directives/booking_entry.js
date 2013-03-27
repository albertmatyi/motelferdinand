/*global define*/

define(
	[],
	function () {
		"use strict";
		var getBEDir = function (name, key) {
			return {
				'value' : function () {
					return this[key];
				},
				'name' : function () {
					return ['bookingEntry', name].join('.');
				}
			};
		};
		return {
			'entry-id' : {
				'id' : function () {
					return 'BookingEntry' + this.index;
				}
			},
			'index' : {
				'text' : function () {
					return this.index + 1;
				}
			},
			'booking-entry-bookableId' : getBEDir('bookable_id', 'id'),
			'booking-entry-quantity' : getBEDir('quantity', 'quantity'),
			'booking-entry-bookFrom' : getBEDir('book_from', 'from'),
			'booking-entry-bookUntil' : getBEDir('book_until', 'until')
		};
	}
);