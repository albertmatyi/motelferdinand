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
	         "smooth_scroll",	
			"picaslide",
			"transparency_directives/menu",
			"transparency_directives/content",
			"switches"
			],function(dp, ss, hf, ps, tdm, tdc, sw){
		model.categories.sort(function(c0, c1) {
			return c0.order - c1.order;
		});
		model.categories.map(function(c) {
			c.contents.sort(function(c0, c1) {
				return c0.order - c1.order;
			});
		});
		$('.category-nav').render(model.categories, tdm.menuDirective);
		sw.RENDER_CONTENT &&
		$('.categories').render(model.categories, tdc.contentDirective);
		
		sw.RENDER_GALLERIES && 
		$('.contents div.picaslide').each(function(idx, el) {
			$(el).picaslide({play: 3500, pause: 5000, hoverPause: true, slideSpeed: 850});
		});
		sw.RENDER_HEADER && 
		$('#header .picaslide').each(function(idx, el) {
			$(el).picaslide({play: 5000, pause: 5000, hoverPause: true, slideSpeed: 1850});
		});
		sw.RENDER_BOOKING_GALLERIES && 
		$('.bookables .bookable-picaslide').each(function(idx, el) {
			$(el).picaslide({effect: 'fade', play: 3500, pause: 5000, hoverPause: true, slideSpeed: 850});
		});
		
		$('.datepicker').datepicker({
		    format: 'dd-mm-yyyy',
		    todayHighlight : true,
		    todayBtn : true,
		    autoclose : true
		});
		sw.RENDER_BOOKING &&
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
		sw.RENDER_BOOKING &&
		$('.booking-form').each(function(idx, el){
			$el = $(el);
			l = $('select', el).length; 
			if(l == 0){
				$el.remove();
			}
		});
		
		$('[data-spy="scroll"]').each(function() {
			var $spy = $(this).scrollspy('refresh')
		});
		HeaderFixer.activate();
		SmoothScroll.activate();
		if (window.location.hash.length > 1) {
			window.location.hash = window.location.hash;
		} else if (model.categories.length > 0) {
			//window.location.hash = 'Category' + model.categories[0].id;
		}
	// close the ordered requires
	});	});	
	//close the function & define
	});