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
	'controllers/admin/commons'
],
function (jq, i18n, adminControls, bookableDirective, transparency, common, view, booking, modal, adminCommons) {
	'use strict';

	var PRICES_SELECTOR = 'tbody input[name=prices\\.values]';
	var optionDirective = {
		'value' : {
			'text' : function () {
				return this.value;
			},
			'value' : function () {
				return this.value;
			}
		}
	};

	var $bookableTemplate = $('.bookables').clone();

	var TAB_ID_BASE = 'editBookable-';

	var $formModal = $('#bookableEditFormModal');

	var $moveToCategoryElement = $('.move-to-category', $formModal);

	var $pricesTable = $('.prices.table', $formModal);

	var $priceCell = $('tbody td.values', $pricesTable).clone();

	var $priceHCell = $('thead th.values', $pricesTable).clone();

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
		_populatePrices(entity.prices);
		adminCommons.initMoveToCategory($moveToCategoryElement, entity, 'bookable', function (categoryId) {
			var $catContents = $('#Category' + categoryId + '	.bookables');
			$('#Bookable' + entity.id).appendTo($catContents);
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

	$('#submitBookableEditForm').click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/bookables/', saveSuccess, saveFail, formatPrices);
	});

	var formatPrices = function (data) {
		delete data['prices.values'];
		data.prices = gatherPrices();
		return data;
	};

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
			optionDirective
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
			var prices = gatherPrices();
			renderPrices($el.val());
			_populatePrices(prices);
		});
	};


	var initForm = function () {
		initQuantitySelect();
		initPlacesSelect();
		$('.currency', $priceCell).text(model.currency['default']);
	};

	var renderPrices = function (n) {
		$('tr', $pricesTable).each(function (idx, tr) {
			var $tr = $(tr);
			$('.values', tr).remove();
			var els = [];
			for (var i = n; i > 0; i -= 1) {
				var c;
				if (idx === 0) {
					c = $priceHCell.clone();
					c.text(c.text().replace(/\d+/, i));
				} else {
					c = $priceCell.clone();
					c.attr('name', c.attr('name'));
				}
				els.unshift(c);
			}
			$tr.append(els);
		});
	};

	var _populatePrices = function (prices) {
		var inputs = $(PRICES_SELECTOR, $pricesTable);
		for (var i = inputs.length - 1; i >= 0; i -= 1) {
			var input = inputs[i];
			if (prices.values.length > i) {
				$(input).val(prices.values[i]);
			}
		}
	};

	var gatherPrices = function () {
		var prices = {};
		prices.values = $(PRICES_SELECTOR, $pricesTable)
			.serializeObject()['prices.values'];
		if (typeof prices.values === 'string') {
			prices.values = [prices.values];
		}
		return prices;
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