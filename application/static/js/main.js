categoriesMenuDirective = {
	title : {
		href : function(params) {
			return '#Category' + this.id;
		},
		'class': function (params){
			return this.subcategories.length > 0 ? 'dropdown-toggle' : '';
		},
		'data-toggle': function(params){
			return this.subcategories.length > 0 ? 'dropdown':'';
		},
		html: function (params){
			return this.title + (this.subcategories.length > 0 ? '<b class="caret"></b>':'');
		}
	},
	visible : {
		'class' : function(params) {
			return this.subcategories.length > 0 ? 'dropdown' : '';
		},
		text: function(params){
			return '';
		}
	},
	subcategories : {
		title : {
			href : function(params) {
				return '#Category' + this.id;
			},
			'class': function (params){
				return this.subcategories.length > 0 ? 'dropdown-toggle' : '';
			},
			'data-toggle': function(params){
				return this.subcategories.length > 0 ? 'dropdown':'';
			},
			html: function (params){
				return this.title + (this.subcategories.length > 0 ? '<b class="caret"></b>':'');
			}
		}
	}
};

$(window).load(function() {
	// transparency.register($);
	$('.category-nav').render(model.categories, categoriesMenuDirective);
	// $('.category-nav').render(model.categories);
	$('#navbar').scrollspy();
});