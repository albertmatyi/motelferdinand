define(
	[
	 	"/static/lib/jquery-1.7.2.min.js"
	],
    function(){
	require(["/static/lib/jquery-ui-1.8.20.custom.min.js",
	         "/static/lib/bootstrap/js/bootstrap.min.js",
	         "/static/lib/slides.min.jquery.js",
			"/static/lib/picasa.js",
			"/static/lib/transparency.min.js",
			"elements/social",
			'model/base'],function(){
	require(["/static/lib/bootstrap-datepicker/datepicker.js",
			"helpers/picaslide",
			"directives/menu",
			"directives/body_content",
			"switches",
			"controllers/category",
			'controllers/admin/category',
			'controllers/admin/content',
			'controllers/admin/bookable',
			'controllers/admin/booking',
			'controllers/booking',
			],function(dp, ps, tdm, tdc, sw, cis, acat, acont, abookables){		

		sw.RENDER_HEADER &&
		$('.category-nav').render(model.categories, tdm.menuDirective);

		$('.language.dropdown-menu').render(model.languages, tdm.languageDirective);

		sw.RENDER_CONTENT &&
		$('.categories').render(model.categories, tdc.contentDirective) &&
		$('.content.span4').css('margin-left',parseInt($('.content.span4').css('margin-left'))*.5+'px');
		
		sw.RENDER_GALLERIES && 
		$('.content-description div.picaslide, .category-description div.picaslide').each(function(idx, el) {
			$el = $(el);
			$el.addClass('span4');
			$el.picaslide({pause: 5000, hoverPause: true, slideSpeed: 850});
		});
		
		// BOOKING 
		
		$('.bookables-wrapper').each(function(idx, el){
			$el = $(el);
			l = $('.bookable', el).length; 
			if(sw.RENDER_BOOKING && l > 0 ){
				var tmpW = $el.width();
				$('.bookable', el).css('width', tmpW+'px');
				$('.bookables', el).css('width', tmpW+'px');
				$('.bookables-slide-wrapper', el).css('width', tmpW + 'px');
				$('.bookable, .bookables', el).css('height', '430px');
				$('.bookables-slide-wrapper', el).slides({container: 'bookables'});
				mgl = parseInt($el.css('margin-left'))*.5;
				$el.width($el.width()-mgl);
				$el.css('margin-left', mgl+'px');
			} else{
				$el.remove();
			}
		});		
		
		sw.RENDER_BOOKING_GALLERIES && 
		$('.bookables .bookable-picaslide').each(function(idx, el) {
			$el = $(el);
			$el.addClass('span4');
			$el.picaslide({effect: 'fade', pause: 5000, hoverPause: true, slideSpeed: 850});
		});
		
		sw.RENDER_DATEPICKERS && 
		$('.datepicker').datepicker({
		    format: 'dd-mm-yyyy',
		    todayHighlight : true,
		    todayBtn : true,
		    autoclose : true
		});

		// DEFAULT SELECTION
		
		if (window.location.hash.length > 1) {
			window.location.hash = window.location.hash;
		} else if (model.categories.length > 0) {
			//window.location.hash = 'Category' + model.categories[0].id;
		}
		cis.init();
		$('#loading-overlay').fadeOut(500, function(){
			$(this).remove();
		});
		acat.init();
		acont.init();
		abookables.init();
	// close the ordered requires
	});	});	
	//close the function & define
});