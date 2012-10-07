$(window).load(function() {
	model.categories.sort(function(c0, c1) {
		return c0.order - c1.order;
	});
	model.categories.map(function(c) {
		c.contents.sort(function(c0, c1) {
			return c0.order - c1.order;
		});
	});
	$('.category-nav').render(model.categories, categoriesMenuDirective);
	$('.categories').render(model.categories, categoriesDirective);
	$('[data-spy="scroll"]').each(function() {
		var $spy = $(this).scrollspy('refresh')
	});
	$('#navbar').scrollspy();
	$('div.picaslide').each(function(idx, el) {
		$(el).picaslide({play: 3500, pause: 5000, hoverPause: false, slideSpeed: 850});
	});
	HeaderFixer.activate();
	SmoothScroll.activate();
	if (window.location.hash.length > 1) {
		window.location.hash = window.location.hash;
	} else if (model.categories.length > 0) {
		// window.location.hash = 'Category' + model.categories[0].id;
	}
});

categoriesMenuDirective = {
	title : {
		href : function(params) {
			return '#Category' + this.id;
		},
		'class' : function(params) {
			return this.subcategories.length > 0 ? 'dropdown-toggle' : '';
		},
		'data-toggle' : function(params) {
			return this.subcategories.length > 0 ? 'dropdown' : '';
		},
		html : function(params) {
			return this.title
					+ (this.subcategories.length > 0 ? '<b class="caret"></b>'
							: '');
		}
	},
	visible : {
		'class' : function(params) {
			return this.subcategories.length > 0 ? 'dropdown' : '';
		},
		text : function(params) {
			return '';
		}
	},
	subcategories : {
		title : {
			href : function(params) {
				return '#Category' + this.id;
			},
			'class' : function(params) {
				return this.subcategories.length > 0 ? 'dropdown-toggle' : '';
			},
			'data-toggle' : function(params) {
				return this.subcategories.length > 0 ? 'dropdown' : '';
			},
			html : function(params) {
				return this.title
						+ (this.subcategories.length > 0 ? '<b class="caret"></b>'
								: '');
			}
		}
	}
};

var categoriesDirective = {
	id : {
		id : function(params) {
			return 'Category' + this.id;
		},
		text : function(params) {
			return '';
		}
	},
	contents : {
		description : {
			html : function(params) {
				return this.description;
			}
		}
	}
}