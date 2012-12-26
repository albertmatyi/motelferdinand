requirejs.config({
	paths : {
		'jquery': '/static/lib/jquery-1.7.2.min.js',
		'jquery-ui': '/static/lib/jquery-ui-1.8.20.custom.min.js',
		'bootstrap': '/static/lib/bootstrap/js/bootstrap.min.js',
		'slides': '/static/lib/slides.min.jquery.js',
		'picasa': '/static/lib/picasa.js',
		'transparency': '/static/lib/transparency.min.js'
	},

    shim: {
    	'jquery-ui': {
    	deps: ['jquery']
	    },
	    'bootstrap': {
	    	deps: ['jquery']
	    },
	    'slides': {
	    	deps: ['jquery']
	    },
	    'picasa': {
	    	deps: ['jquery']
	    },
	    'transparency' :{
	    	deps: ['jquery']	
	    }
    }
});

define(
[
"elements/social",
'model/base',
'helpers/picaslide',
'flags',
'view/category',
'view/language',
'controllers/admin/category',
'controllers/admin/content',
'controllers/admin/bookable',
'controllers/admin/booking',
'controllers/booking'
],
function(categoryView, languageView, categoryAdmin, contentAdmin, bookableAdmin){		
	categoryView.render(model.categories);

	// DEFAULT SELECTION
	if (window.location.hash.length > 1) {
		window.location.hash = window.location.hash;
	} else if (model.categories.length > 0) {
		//window.location.hash = 'Category' + model.categories[0].id;
	}
	
	$('#loading-overlay').fadeOut(500, function(){
		$(this).remove();
	});
	categoryAdmin.init();
	contentAdmin.init();
	bookableAdmin.init();
//close the function & define
});