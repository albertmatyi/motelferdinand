/*global define */
/*global $ */
/*global model */
/*global _ */

define([
	'lib/jquery',
	'helpers/i18n',
	'elements/admin/controls',
	'view/directives/bookable_variant',
	'helpers/transparency',
	'view/common',
	'view/bookable_variant',
	'elements/modal'
],
function (jq, i18n, adminControls, bookableVariantDirective, transparency, common, view, modal) {
	'use strict';

	var $bookableVariantTemplate = $('.bookableVariants').clone();

	var TAB_ID_BASE = 'editBookableVariant-';

	var $formModal = $('#bookableVariantEditFormModal');

	i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

	var deletedCallback = function (deletedId) {
		// rerender the bookableVariants
		var bkblVariant = model.db.bookableVariant[deletedId];
		var bkbl = model.db.bookable[bkblVariant.bookable];
		bkbl.bookableVariants.splice(_.indexOf(bkbl.bookableVariants, bkblVariant), 1);
		$('#BookableVariant' + deletedId).remove();
		delete model.db.bookableVariant[deletedId];
	};

	var initAdminControls = function ($ctxt) {
		if (!$ctxt) {
			$ctxt = $('body .bookable-variants');
		}
		var $controls = $('.admin-controls', $ctxt);
		adminControls.init($formModal, $controls, 'bookable_variants', deletedCallback);
	};

	var addNewUI = function (bookable, bookableVariant) {
		var $newUI = $bookableVariantTemplate.clone()
			.render(bookableVariant, bookableVariantDirective)
			.children('.bookableVariant');
		$('#Bookable' + bookable.id + ' .bookable-variants').append($newUI);
		initAdminControls($newUI);
		view.render($('#Bookable' + bookable.id));
	};

	var add = function (entity) {
		model.db.bookableVariant[entity.id] = entity;
		var bkbl = model.db.bookable[entity.bookable];
		bkbl.bookableVariants.push(entity);
		addNewUI(bkbl, entity);
	};

	var saveSuccess = function (entity, isNew) {
		$formModal.modal('hide');
		// update UI
		if (!isNew) {
			var $cont = $('#BookableVariant' + entity.id);
			$cont.render(entity, bookableVariantDirective);
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

	$('#submitBookableVariantEditForm').click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/bookable_variants/', saveSuccess, saveFail);
	});


	var initAddButton = function ($context) {
		if (typeof ($context) === 'undefined') {
			$context = $('body');
		}
		var $addBookableVariantButton = $('.bookable .admin-controls .add-variant', $context);

		$addBookableVariantButton.click(function (e) {
			e.preventDefault();
			//populate the form with data
			i18n.populateForm($('form', $formModal), {bookable : $(this).data('entity').id});
			//show the edit bookableVariant form
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