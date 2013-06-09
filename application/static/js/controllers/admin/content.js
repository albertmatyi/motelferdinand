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
	'elements/modal'
],
function (jq, i18n, adminControls, transparency, common, directive, modal) {
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
		if (typeof($context) === 'undefined') {
			$context = $('body');
		}
		var $addContentButton = $('.page-header .admin-controls .addContentButton', $context);

		$addContentButton.click(function (e) {
			e.preventDefault();
			//populate the form with data
			i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
			$moveToCategoryElement.hide();
			modal.displayNotification($contentEditFormModal, i18n.translate('Moved'), 'success');
			//show the edit content form
			$formModal.modal('show');
		});
	};

	var moveToCategory = function (entity, categoryId) {
		$.ajax({
			'method': 'POST',
			'url': '/admin/content/move/' + entity.id,
			'type': 'json', 
			'data': {'data': JSON.stringify({'id': entity.id, 'category_id': categoryId})},
			'success': function (data) {
				var $catContents = $('#Category' + categoryId + '	.contents');
				$('#Content' + entity.id).appendTo($catContents);
			}
		});
	};

	var editCallback = function ($form, entity) {
		$moveToCategoryElement.show();
		var opts = [];
		for (var i = model.categories.length - 1; i >= 0; i--) {
			var cat = model.categories[i];
			opts.unshift('<li data-category="' + cat.id + '"><a href="#">' +
				cat.i18n[model.language].title +
				'</a></li>');
		}
		$('.dropdown-menu', $moveToCategoryElement)
			.html(opts.join(''))
			.off('click')
			.on('click', 'li', function (event) {
				event.preventDefault();
				moveToCategory(entity, $(this).data('category'));
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