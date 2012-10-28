define(
	[
	 	"http://code.jquery.com/jquery-latest.min.js"
	],
    function(){
	require(["/static/lib/jquery-ui-1.8.20.custom.min.js",
	         "/static/lib/bootstrap/js/bootstrap.min.js",
	         "/static/lib/slides.min.jquery.js",
			"/static/lib/picasa.js",
			"/static/lib/transparency.min.js"],function(){
	require(["/static/lib/bootstrap-datepicker/datepicker.js",
			"picaslide",
			"transparency_directives/menu",
			"transparency_directives/content",
			"switches"
			],function(dp, ps, tdm, tdc, sw){
		model.categories.sort(function(c0, c1) {
			return c0.order - c1.order;
		});
		model.categories.map(function(c) {
			c.contents.sort(function(c0, c1) {
				return c0.order - c1.order;
			});
		});
		
		sw.RENDER_HEADER &&
		$('.category-nav').render(model.categories, tdm.menuDirective);

		sw.RENDER_CONTENT &&
		$('.categories').render(model.categories, tdc.contentDirective);
		
		sw.RENDER_GALLERIES && 
		$('.content-description div.picaslide, .category-description div.picaslide').each(function(idx, el) {
			$el = $(el);
			$el.addClass('span4');
			$el.picaslide({play: 3500, pause: 5000, hoverPause: true, slideSpeed: 850});
		});
		
		// BOOKING 
		
		$('.bookables-wrapper').each(function(idx, el){
			$el = $(el);
			l = $('.bookable', el).length; 
			if(sw.RENDER_BOOKING && l > 0 ){
				$('.bookable', el).css('width', $el.width()+'px');
				$('.bookables', el).css('width', $el.width()+'px');
				$('.bookable, .bookables', el).css('height', '430px');
				$el.slides({container: 'bookables'});
			} else{
				$el.remove();
			}
		});
		// delete forms for unused bookings in categories
		$('.booking-form').each(function(idx, el){
			$el = $(el);
			l = $('select', el).length; 
			if(!sw.RENDER_BOOKING || l == 0){
				$el.remove();
			}
		});
		
		sw.RENDER_BOOKING_GALLERIES && 
		$('.bookables .bookable-picaslide').each(function(idx, el) {
			$el = $(el);
			$el.addClass('span8');
			$el.picaslide({effect: 'fade', play: 3500, pause: 5000, hoverPause: true, slideSpeed: 850});
		});
		
		sw.RENDER_DATEPICKERS && 
		$('.datepicker').datepicker({
		    format: 'dd-mm-yyyy',
		    todayHighlight : true,
		    todayBtn : true,
		    autoclose : true
		});

		// SCROLL SPY
		
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this).scrollspy('refresh')
		});
		
		// DEFAULT SELECTION
		
		if (window.location.hash.length > 1) {
			window.location.hash = window.location.hash;
		} else if (model.categories.length > 0) {
			//window.location.hash = 'Category' + model.categories[0].id;
		}
	// close the ordered requires
	});	});	
	//close the function & define
	});