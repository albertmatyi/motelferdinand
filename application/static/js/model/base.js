define(
[
	'lib/jquery'
], 
function(){
	var EntityMap = function(){
		var map = {};
		
		return map;
	};

	// sort categories by their order
	model.categories.sort(function(c0, c1) {
		return c0.order - c1.order;
	});
	// sort contents by their order
	jQuery.map(model.categories,function(c) {
		c.contents.sort(function(c0, c1) {
			return c0.order - c1.order;
		});
	});
	model.db = {};
	model.db.user = EntityMap();
	model.db.category = EntityMap();
	model.db.content = EntityMap();
	model.db.booking = EntityMap();
	model.db.bookable = EntityMap();
	// model.db.bookingEntry = {};

	for (var i = model.categories.length - 1; i >= 0; i--) {
		var cat = model.categories[i];
		model.db.category[cat.id] = cat;
		for (var j = cat.contents.length - 1; j >= 0; j--) {
			var content = cat.contents[j];
			model.db.content[content.id] = content;
		};
		for (var k = cat.bookables.length - 1; k >= 0; k--) {
			var bookable = cat.bookables[k];
			model.db.bookable[bookable.id] = bookable;
		};
	};
	for (var i = model.bookings.length - 1; i >= 0; i--) {
		var bk = model.bookings[i];
		model.db.booking[bk.id] = bk;
		var u = bk.user;
		model.db.user[u.id] = u;
	};

});