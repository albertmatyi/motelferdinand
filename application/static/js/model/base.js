define(
[], 
function(){
	// sort categories by their order
	model.categories.sort(function(c0, c1) {
		return c0.order - c1.order;
	});
	// sort contents by their order
	model.categories.map(function(c) {
		c.contents.sort(function(c0, c1) {
			return c0.order - c1.order;
		});
	});
	model.db = {};
	model.db.user = {};
	model.db.category = {};
	model.db.content = {};
	model.db.booking = {};
	model.db.bookable = {};
	// model.db.bookingEntry = {};

	for (var i = model.categories.length - 1; i >= 0; i--) {
		var cat = model.categories[i];
		model.db.category[cat.id] = cat;
		for (var i = cat.contents.length - 1; i >= 0; i--) {
			var content = cat.contents[i];
			model.db.content[content.id] = content;
		};
		for (var i = cat.bookables.length - 1; i >= 0; i--) {
			var bookable = cat.bookables[i];
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