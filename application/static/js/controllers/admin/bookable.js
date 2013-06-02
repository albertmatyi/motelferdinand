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

	var languageDirective = {
		'lang_id' : {
			'text' : function () {
				return '';
			},
			'class' : function () {
				return  this.lang_id;
			}
		}
	};

	var $bookableTemplate = $('.bookables').clone();

	var TAB_ID_BASE = 'editBookable-';

	var $formModal = $('#bookableEditFormModal');

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

	var initAdminControls = function ($ctxt) {
		if (!$ctxt) {
			$ctxt = $('body .bookables');
		}
		var $controls = $('.admin-controls', $ctxt);
		adminControls.init($formModal, $controls, 'bookables', deletedCallback, populatePrices);
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


	$('#submitBookableEditForm').click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		var $form = $('form', $formModal);
		i18n.submitForm($form, '/admin/bookables/', function (entity, isNew) {
			$formModal.modal('hide');
			// update UI
			if (!isNew) {
				var $cont = $('#Bookable' + entity.id);
				$cont.render(entity, directive);
				booking.reset();
			} else {
				add(entity);
			}
			modal.displayNotification($formModal, 'Modified successfully!', 'success');
		}, undefined, formatPrices);
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

	var initPriceTable = function () {
		$('tbody', $pricesTable).render(model.languages, languageDirective);
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
		initPriceTable();
		initQuantitySelect();
		initPlacesSelect();
	};

	var renderPrices = function (n) {
		$('tr', $pricesTable).each(function (idx, tr) {
			var $tr = $(tr);
			$('.values', tr).remove();
			for (var i = 1; i <= n; i += 1) {
				var c;
				if (idx === 0) {
					c = $priceHCell.clone();
					c.text(c.text().replace(/\d+/, i));
				} else {
					c = $priceCell.clone();
					c.attr('name', c.attr('name'));
				}
				$tr.append(c);
			}
		});
	};

	var _populatePrices = function (prices) {
		for (var langId in prices) {
			if (prices.hasOwnProperty(langId)) {
				$('tr.' + langId + ' .currency', $pricesTable)
					.text(model.currency.selected);
				$('tr.' + langId + ' input[name=prices\\.values]', $pricesTable)
					.each(function (i, input) {
						if (prices[langId].values.length > i) {
							$(input).val(prices[langId].values[i]);
						}
					});
			}
		}
	};

	var gatherPrices = function () {
		var prices = {};
		for (var i = model.languages.length - 1; i >= 0; i -= 1) {
			var langId = model.languages[i].lang_id;
			prices[langId] = {};
			prices[langId].values =
				$('tr.' + langId + ' input[name=prices\\.values]', $pricesTable)
				.serializeObject()['prices.values'];
			if (typeof prices[langId].values === 'string') {
				prices[langId].values = [prices[langId].values];
			}
		}
		return prices;
	};

	var populatePrices = function ($form, bookable) {
		_populatePrices(bookable.prices);
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