/*global define */
/*global model */
/*global $*/

define(
[
	'lib/jquery'
],
function () {
	"use strict";

	$.fn.serializeObject = function () {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	var EntityMap = function () {
		var map = {};

		return map;
	};

	// sort categories by their order
	model.categories.sort(function (c0, c1) {
		return c0.order - c1.order;
	});
	// sort contents by their order
	jQuery.map(model.categories, function (c) {
		c.contents.sort(function (c0, c1) {
			return c0.order - c1.order;
		});
	});
	model.db = {};
	model.db.user = new EntityMap();
	model.db.category = new EntityMap();
	model.db.content = new EntityMap();
	model.db.booking = new EntityMap();
	model.db.bookable = new EntityMap();
	// model.db.bookingEntry = {};

	for (var i = model.categories.length - 1; i >= 0; i--) {
		var cat = model.categories[i];
		model.db.category[cat.id] = cat;
		for (var j = cat.contents.length - 1; j >= 0; j--) {
			var content = cat.contents[j];
			model.db.content[content.id] = content;
		}
		for (var k = cat.bookables.length - 1; k >= 0; k--) {
			var bookable = cat.bookables[k];
			model.db.bookable[bookable.id] = bookable;
		}
	}
	for (i = model.bookings.length - 1; i >= 0; i--) {
		var bk = model.bookings[i];
		model.db.booking[bk.id] = bk;
		var u = bk.user;
		model.db.user[u.id] = u;
	}
});