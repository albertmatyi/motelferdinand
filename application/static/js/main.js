define(
[
 	"/static/lib/jquery-1.7.2.min.js"
],
function(){
require(
[
"/static/lib/jquery-ui-1.8.20.custom.min.js",
"/static/lib/bootstrap/js/bootstrap.min.js",
"/static/lib/slides.min.jquery.js",
"/static/lib/picasa.js",
"/static/lib/transparency.min.js",
"elements/social",
'model/base',
'helpers/picaslide',
'flags'
],
function(){
require(
[
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
// close the ordered requires
});	
});	
//close the function & define
});