/*global define */
/*global $ */
/*global model */
/*global _ */

define(
[
	'helpers/i18n',
	'elements/admin/controls',
	'helpers/transparency',
	'view/common',
	'view/admin/modal',
	'view/directives/content'
],
function (i18n, adminControls, transparency, common, modal, directive) {
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
		var cont = model.db.content[deletedId];
		delete model.db.content[deletedId];

		var cat = model.db.category[cont.category];
		var idx = _.indexOf(cat.contents, cont);
        if (idx > -1) {
            cat.contents.splice(idx, 1);
        }
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
			$context = $('body .contents');
		}
		var $controls = $('.admin-controls', $context);
		adminControls.init($formModal, $controls, 'contents', deletedCallback);
	};

	return {'init': function () {
			modal.init($formModal);
			initAdminControls();
			initAddButton();
		},
		'initAddButton' : initAddButton,
		'initAdminControls' : initAdminControls
	};
//close the function & define
});