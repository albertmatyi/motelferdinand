/*global define */
/*global $ */
/*global model */
/*global _ */

define([
	'lib/jquery',
	'helpers/i18n',
	'elements/admin/controls',
	'view/directives/bookable',
	'helpers/transparency',
	'view/common',
	'view/bookable',
	'controllers/booking',
	'elements/modal',
	'view/directives/common',
	'controllers/admin/commons',
	'controllers/admin/bookable_prices'
],
function (jq, i18n, adminControls, bookableDirective, transparency, common, view, booking, modal, commonDirectives, adminCommons, bookablePrices) {
	'use strict';

	var $bookableTemplate = $('.bookables').clone();

	var TAB_ID_BASE = 'editBookable-';

	var $formModal = $('#bookableEditFormModal');

	var $moveToCategoryElement = $('.move-to-category', $formModal);

	i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

	var deletedCallback = function (deletedId) {
		// rerender the bookables
		var bkbl = model.db.bookable[deletedId];
		var cat = model.db.category[bkbl.category];
		cat.bookables.splice(_.indexOf(cat.bookables, bkbl), 1);
		$('#Bookable' + deletedId).remove();
		delete model.db.bookable[deletedId];
	};

	var editCallback = function ($form, entity) {
		bookablePrices.populate(entity.prices);
		adminCommons.initMoveToCategory($moveToCategoryElement, entity, 'bookable', function (categoryId) {
			var $catContents = $('#Category' + categoryId + '	.bookables');
			$('#Bookable' + entity.id).appendTo($catContents);
			$('input[name=category]', $formModal).val(categoryId);
			modal.displayNotification($formModal, i18n.translate('Moved'), 'success');
		});
	};


	var initAdminControls = function ($ctxt) {
		if (!$ctxt) {
			$ctxt = $('body .bookables');
		}
		var $controls = $('.admin-controls', $ctxt);
		adminControls.init($formModal, $controls, 'bookables', deletedCallback, editCallback);
	};

	var addNewUI = function (category, bookable) {
		var $newUI = $bookableTemplate.clone()
			.render(bookable, bookableDirective)
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

	var saveSuccess = function (entity, isNew) {
		$formModal.modal('hide');
		// update UI
		if (!isNew) {
			var $cont = $('#Bookable' + entity.id);
			$cont.render(entity, bookableDirective);
			booking.reset();
		} else {
			add(entity);
		}
		modal.displayNotification($formModal, 'Modified successfully!', 'success');
	};

	var saveFail = function (err) {
		var txt = 'Error while saving.';
		try {
			err = JSON.parse(err.responseText);
			txt = err.message ? err.message:err;
		} catch (e) {
			txt = err.responseText;
		}
		modal.displayNotification($formModal, txt, 'error');
	};

	var format = function (data) {
		return bookablePrices.format(data);
	};

	$('#submitBookableEditForm').click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/bookables/', saveSuccess, saveFail, format);
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

	var addOptions = function ($el, n) {
		$el.render(
			_.range(1, n + 1),
			commonDirectives.option
		);
	};

	var initQuantitySelect = function () {
		var $el = $('select[name=quantity]', $formModal);
		addOptions($el, 10);
	};

	var initPlacesSelect = function () {
		var $el = $('select[name=places]', $formModal);
		addOptions($el, 10);
		$el.on('change', function () {
			bookablePrices.setForPlaces($el.val());
		});
	};


	var initForm = function () {
		initQuantitySelect();
		initPlacesSelect();
		bookablePrices.init();
	};

	return {
		'init' : function () {
			initAdminControls();
			initAddButton();
			initForm();
		},
		'initAddButton' : initAddButton
	};
//close the function & define
});