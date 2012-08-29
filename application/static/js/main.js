categoriesMenuDirective = {
	title : {
		href : function(params) {
			return '#Category' + this.id;
		}
	}
};

$(window).load(function() {
	// transparency.register($);
	$('.category-nav').render(model.categories, categoriesMenuDirective);
	// $('.category-nav').render(model.categories);
	$('#navbar').scrollspy();
});