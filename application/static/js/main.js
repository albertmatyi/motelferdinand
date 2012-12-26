requirejs.config({
	paths : {
		'lib/jquery': '/static/lib/jquery-1.7.2.min',
		'lib/jquery-ui': '/static/lib/jquery-ui-1.8.20.custom.min',
		'lib/bootstrap': '/static/lib/bootstrap/js/bootstrap.min',
		'lib/slides': '/static/lib/slides.min.jquery',
		'lib/picasa': '/static/lib/picasa',
		'lib/transparency': '/static/lib/transparency.min',
		'lib/datepicker': '/static/lib/bootstrap-datepicker/datepicker',
		'lib/bootstrap-wysihtml5': '/static/lib/wysihtml5/js/bootstrap-wysihtml5'
	},

    shim: {
    	'lib/jquery-ui': {
    	deps: ['lib/jquery']
	    },
	    'lib/bootstrap': {
	    	deps: ['lib/jquery']
	    },
	    'lib/slides': {
	    	deps: ['lib/jquery', 'lib/jquery-ui']
	    },
	    'lib/picasa': {
	    	deps: ['lib/jquery']
	    },
	    'lib/transparency' :{
	    	deps: ['lib/jquery']	
	    },
	    'lib/datepicker': {
	    	deps: ['lib/jquery']
	    }
    }
});

define(
[
"elements/social",
'model/base',
'flags',
'view/category',
'view/language',
'controllers/admin/category',
'controllers/admin/content',
'controllers/admin/bookable',
'controllers/admin/booking',
'controllers/booking'
],
function(social, modelBase, flags, categoryView, languageView, categoryAdmin, contentAdmin, bookableAdmin){		
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