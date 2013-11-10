/*global define */
/*global model */
/*global $*/

define(
[
	'lib/jquery'
],
function () {
	'use strict';

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

	var langs = [];
	for (var lk in model.languages) {
		if (model.languages.hasOwnProperty(lk)) {
			langs.push({'lang_id': lk, 'name': model.languages[lk]});
		}
	}

	model.languages = langs;
	model.currency.selected = model.currency.selected || model.currency['default'];

	// sort categories by their weight
	model.categories.sort(function (c0, c1) {
		return c0.weight - c1.weight;
	});
	// sort contents by their weight
	$.map(model.categories, function (c) {
		c.contents.sort(function (c0, c1) {
			return c0.weight - c1.weight;
		});
		c.bookables.sort(function (c0, c1) {
			return c0.weight - c1.weight;
		});
	});
	model.db = {};
	model.db.user = new EntityMap();
	model.db.category = new EntityMap();
	model.db.content = new EntityMap();
	model.db.booking = new EntityMap();
	model.db.bookable = new EntityMap();
	model.db.bookableVariant = new EntityMap();


	for (var i = model.categories.length - 1; i >= 0; i -= 1) {
		var cat = model.categories[i];
		model.db.category[cat.id] = cat;
		for (var j = cat.contents.length - 1; j >= 0; j -= 1) {
			var content = cat.contents[j];
			model.db.content[content.id] = content;
		}
		for (var k = cat.bookables.length - 1; k >= 0; k -= 1) {
			var bookable = cat.bookables[k];
			model.db.bookable[bookable.id] = bookable;
			for (var l = bookable.bookable_variants.length - 1; l >= 0; l -= 1) {
				var bookableVariant = bookable.bookable_variants[l];
				model.db.bookableVariant[bookableVariant.id] = bookableVariant;
			}
			bookable.bookableVariants = bookable.bookable_variants;
			delete bookable.bookable_variants;
		}
	}

	var mapToDB = function (dataArr, name) {
		model.db[name] = {};
		for (i = dataArr.length - 1; i >= 0; i -= 1) {
			var dt = dataArr[i];
			model.db[name][dt.id] = dt;
		}
	};

	model.mapToDB = mapToDB;



});