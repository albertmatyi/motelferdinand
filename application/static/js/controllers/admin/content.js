/*global define */
/*global $ */
/*global model */

define(
[
	'helpers/i18n',
	'elements/admin/controls',
	'helpers/transparency',
	'view/common',
	'view/directives/content'
],
function (i18n, adminControls, transparency, common, directive) {
	"use strict";
	var TAB_ID_BASE = 'editContent-';

	var $formModal = $('#contentEditFormModal');

	i18n.renderLanguageTabs($formModal, TAB_ID_BASE);
	/**
	 * Initialize form functionality
	 */
	$('#submitContentEditForm').click(function () {
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/contents/', function (entity, isNew) {
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
		common.renderContentGallery('.content-description div.picaslide', $el);
	};

	var deletedCallback = function (deletedId) {
		//remove the HTML
		$('#Content' + deletedId).remove();
		delete model.db.content[deletedId];
	};

	var initAddButton = function ($context) {
		if (typeof($context) === "undefined") {
			$context = $('body');
		}
		var $addContentButton = $('.page-header .admin-controls .addContentButton', $context);

		$addContentButton.click(function (e) {
			e.preventDefault();
			//populate the form with data
			i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
			//show the edit content form
			$formModal.modal('show');
		});
	};

	var initAdminControls = function ($context) {
		if (typeof($context) === "undefined") {
			$context = $('body');
		}
		var $controls = $('.content .admin-controls');
		adminControls.init($formModal, $controls, 'contents', deletedCallback);
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