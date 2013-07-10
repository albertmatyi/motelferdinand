/*global define */
/*global $ */
/*global model */
/*global _ */

define(
[
	'lib/jquery',
	'helpers/i18n',
	'elements/admin/controls',
	'helpers/transparency',
	'view/common',
	'view/directives/content',
	'elements/modal',
	'controllers/admin/commons'
],
function (jq, i18n, adminControls, transparency, viewCommons, directive, modal, adminCommons) {
	'use strict';
	var TAB_ID_BASE = 'editContent-';

	var $formModal = $('#contentEditFormModal');

	var $moveToCategoryElement = $('.move-to-category', $formModal);

	i18n.renderLanguageTabs($formModal, TAB_ID_BASE);
	/**
	 * Initialize form functionality
	 */
	$('#submitContentEditForm').click(function () {
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/contents/', function (entity, isNew) {
			$formModal.modal('hide');
			// update UI
			if (!isNew) {
				var $cont = $('#Content' + entity.id);
				$('.content-title', $cont).text(entity.i18n[model.language].title);
				$('.content-description', $cont).html(entity.i18n[model.language].description);
			} else {
				add(entity);
				model.db.content[entity.id] = entity;
				model.db.category[entity.category].contents.push(entity);
			}
		});
	});

	var template = $('.contents').html();

	var add = function (entity) {
		var $el = transparency.render(template, entity, directive);
		$('#Category' + entity.category + ' .contents').append($el);

		initAdminControls($el);
		viewCommons.renderContentGallery('.content-description div.picaslide', $el);
	};

	var deletedCallback = function (deletedId) {
		//remove the HTML
		$('#Content' + deletedId).remove();
		var cont = model.db.content[deletedId];
		delete model.db.content[deletedId];

		var cat = model.db.category[cont.category];
		var idx = _.indexOf(cat.contents, cont);
		if (idx > -1) {
			cat.contents.splice(idx, 1);
		}
	};

	var initAddButton = function ($context) {
		if (typeof($context) === 'undefined') {
			$context = $('body');
		}
		var $addContentButton = $('.page-header .admin-controls .addContentButton', $context);

		$addContentButton.click(function (e) {
			e.preventDefault();
			//populate the form with data
			i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
			$moveToCategoryElement.hide();
			//show the edit content form
			$formModal.modal('show');
		});
	};

	var editCallback = function ($form, entity) {
		adminCommons.initMoveToCategory($moveToCategoryElement, entity, 'content', function (categoryId) {
			var $catContents = $('#Category' + categoryId + '	.contents');
			// move visually
			$('#Content' + entity.id).appendTo($catContents);
			$('input[name=category]', $formModal).val(categoryId);
			modal.displayNotification($formModal, i18n.translate('Moved'), 'success');
		});
	};

	var initAdminControls = function ($context) {
		if (typeof($context) === 'undefined') {
			$context = $('body .contents');
		}
		var $controls = $('.admin-controls', $context);
		adminControls.init($formModal, $controls, 'contents', deletedCallback, editCallback);
	};

	return {'init': function () {
			initAdminControls();
			initAddButton();
		},
		'initAddButton' : initAddButton,
		'initAdminControls' : initAdminControls
	};
//close the function & define
});