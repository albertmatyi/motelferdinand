/*global define */
/*global $ */
/*global model */
/*global window */
/*global requirejs */

requirejs.config({
	paths : {
		'lib/jquery' : '../lib/jquery-1.9.1.min',
		'lib/jquery-ui' : '../lib/jquery-ui-1.8.20.custom.min',
		'lib/bootstrap' : '../lib/bootstrap/js/bootstrap.min',
		'lib/slides' : '../lib/slides.min.jquery',
		'lib/picasa' : '../lib/picasa',
		'lib/transparency' : '../lib/transparency.min',
		'lib/datepicker' : '../lib/bootstrap-datepicker/datepicker',
		'lib/bootstrap-wysihtml5' : '../lib/wysihtml5/js/bootstrap-wysihtml5',
		'lib/wysihtml5-parserrules' : '../lib/wysihtml5/js/advanced_parser_rules',
		'lib/wysihtml5-base' : '../lib/wysihtml5/js/wysihtml5-0.3.0',
		'lib/underscore': '../lib/underscore.min'
	},

	waitSeconds: 30,

	shim: {
		'main' : {
			deps : ['lib/jquery']
		},
		'lib/jquery-ui' : {
			deps : ['lib/jquery']
		},
		'lib/bootstrap' : {
			deps : ['lib/jquery']
		},
		'lib/slides' : {
			deps : ['lib/jquery', 'lib/jquery-ui']
		},
		'lib/picasa' : {
			deps : ['lib/jquery']
		},
		'lib/transparency' : {
			deps : ['lib/jquery']
		},
		'lib/datepicker' : {
			deps: ['lib/jquery']
		}
	}
});

define('main',
[
	'lib/underscore',
	'config',
	'elements/social',
	'elements/modal',
	'model/base',
	'view/category',
	'view/language',
	'controllers/category',
	'controllers/booking',
],
function (us, config, social, modal, modelBase, categoryView, languageView,
	category) {
	'use strict';
	categoryView.render(model.categories);
	category.init();

	// DEFAULT SELECTION
	if (window.location.hash.length > 1) {
		window.location.hash = window.location.hash;
	}

	$('#loading-overlay').remove();
	modal.fix().init();
	booking.setup();
//close the function & define
});