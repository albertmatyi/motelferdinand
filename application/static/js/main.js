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
	$('.contents div.picaslide').each(function(idx, el) {
		$(el).picaslide({play: 3500, pause: 5000, hoverPause: true, slideSpeed: 850});
	});
	$('#header .picaslide').each(function(idx, el) {
		$(el).picaslide({play: 5000, pause: 5000, hoverPause: true, slideSpeed: 1850});
	});
	$('.bookables .bookable-picaslide').each(function(idx, el) {
		$(el).picaslide({effect: 'fade', play: 3500, pause: 5000, hoverPause: true, slideSpeed: 850});
	});
	$('.datepicker').datepicker({
	    format: 'mm-dd-yyyy'
	});
	$('.bookables-wrapper').each(function(idx, el){
		$el = $(el);
		l = $('.bookable', el).length; 
		if(l > 0){
			$('.bookable', el).css('width', $el.width()+'px');
			$('.bookables', el).css('width', $el.width()+'px');
			$('.bookable, .bookables', el).css('height', '430px');
			$el.slides({container: 'bookables'});
		} else{
			$el.remove();
		}
	});
	$('.booking-form').each(function(idx, el){
		$el = $(el);
		l = $('select', el).length; 
		if(l == 0){
			$el.remove();
		}
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
	},
	bookables : {
		description : {
			html : function(params) {
				return this.description;
			}
		},
		album_url : {
			text : function(params){
				return '';
			},
			'class' : function(params){
				return 'bookable-picaslide picaslide';
			},
			'data-picaslide-username' : function(params){
				 return /.com(\/photos)?\/(\d+)/.exec(this.album_url)[2];
			},
			'data-picaslide-albumid' : function(params){
				return /.com(\/photos)?\/\d+(\/albums)?\/([^\/#]+)/.exec(this.album_url)[3]; 
			},
			'data-picaslide-width' : function(params){
				return '400px';
			},
			'data-picaslide-height' : function(params){
				return '300px';
			}
		},
		quantity : {
			html : function(params) {
				var html = '';
				for( var i = 0; i <= this.quantity; i++){
					html += '<option value="'+i+'">'+i+'</option>'
				}
				return html;
			},
			name : function(params) {
				return 'bookable'+this.id+'quantity';
			},
			id : function(params) {
				return 'bookable'+this.id+'quantity';
			} 
		}
	}
}