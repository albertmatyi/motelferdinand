/*global define */
/*global $ */
/*global model */
/*global _ */

define(
[
	'lib/jquery',
	'helpers/i18n',
	'elements/admin/controls',
	'view/directives/bookable',
	'helpers/transparency',
	'view/common',
	'view/bookable',
	'controllers/booking',
	'elements/modal'
],
function (jq, i18n, adminControls, directive, transparency, common, view, booking, modal) {
	'use strict';
	var $bookableTemplate = $('.bookables').clone();

	var TAB_ID_BASE = 'editBookable-';

	var $formModal = $('#bookableEditFormModal');

	i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

	var deletedCallback = function (deletedId) {
		// rerender the bookables
		var bkbl = model.db.bookable[deletedId];
		var cat = model.db.category[bkbl.category];
		cat.bookables.splice(_.indexOf(cat.bookables, bkbl), 1);
		$('#Bookable' + deletedId).remove();
		delete model.db.bookable[deletedId];
	};

	var initAdminControls = function ($ctxt) {
		if (!$ctxt) {
			$ctxt = $('body .bookables');
		}
		var $controls = $('.admin-controls', $ctxt);
		adminControls.init($formModal, $controls, 'bookables', deletedCallback);
	};

	var addNewUI = function (category, bookable) {
		var $newUI = $bookableTemplate.clone()
			.render(bookable, directive)
			.children('.bookable');
		$('#Category' + category.id + ' .bookables').append($newUI);
		initAdminControls($newUI);
		view.render($('#Category' + category.id));
		booking.setup(bookable);
	};

	var add = function (entity) {
		model.db.bookable[entity.id] = entity;
		var cat = model.db.category[entity.category];
		cat.bookables.push(entity);
		addNewUI(cat, entity);
	};


	$('#submitBookableEditForm').click(function () {
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/bookables/', function (entity, isNew) {
			// update UI
			if (!isNew) {
				var $cont = $('#Bookable' + entity.id);
				$('.bookable-title', $cont).text(entity.i18n[model.language].title);
				$('.bookable-description', $cont).html(entity.i18n[model.language].description);
				$('*[data-bind=price]', $cont).text(entity.price);
				$('*[data-bind=beds]', $cont).text(entity.beds);
				$('*[data-bind=beds]', $cont).text(entity.beds);
				booking.reset();
			} else {
				add(entity);
			}
			modal.displayNotification($formModal, 'Modified successfully!', 'success');
		});
	});

	var initAddButton = function ($context) {
		if (typeof ($context) === 'undefined') {
			$context = $('body');
		}
		var $addBookableButton = $('.page-header .admin-controls .addBookableButton', $context);

		$addBookableButton.click(function (e) {
			e.preventDefault();
			//populate the form with data
			i18n.populateForm($('form', $formModal), {category : $(this).data('entity').id});
			//show the edit bookable form
			$formModal.modal('show');

		});
	};
	return {
		'init' : function () {
			initAdminControls();
			initAddButton();
		},
		'initAddButton' : initAddButton
	};
//close the function & define
});