/*global define */
/*global $ */
/*global _ */
/*global model */

define([
	'helpers/price',
	'helpers/date',
	'elements/modal',
	'view/directives/common',
	'lib/jquery',
	'lib/underscore'
], function (priceHelper, dateHelper, modalHelper, commonDirectives) {

	var $formModal;
	var $pricesTable;
	var $specialPricesTable;
	var $specialPricesRow;
	var $priceCell;
	var $priceHCell;

	var init = function ($fm) {
		$formModal = $fm;
		$formModal = $('#bookableEditFormModal');
		$pricesTable = $('.prices.table', $formModal);
		$specialPricesTable = $('.special-prices.table', $formModal);
		$specialPricesTable.body = $('tbody', $specialPricesTable);
		$specialPricesTable.headerRow = $('thead tr', $specialPricesTable);
		$specialPricesTable.body.on('click', '.special-prices-remove-btn', removeSpecialPrice);
		$('.special-prices-add-btn', $formModal).on('click', addSpecialPrice);
		$specialPricesRow = $('tbody tr', $specialPricesTable).remove();
		$('select', $specialPricesRow).render(priceHelper.specialRepeat, commonDirectives.option);
		$priceCell = $('tbody td.values', $pricesTable).clone();
		$priceHCell = $('thead th.values', $pricesTable).clone();

		$('.currency', $priceCell).text(model.currency['default']);
	};

	var addSpecialPrice = function () {
		$specialPricesTable.body.append($specialPricesRow.clone());
		$specialPricesTable.headerRow.show();
	};

	var removeSpecialPrice = function () {
		$(this).parents('tr').first().remove();
		if ($specialPricesTable.body.children().length === 0) {
			$specialPricesTable.headerRow.hide();
		}
	};

	var populateFields = function (key, container, values) {
		var inputs = $(selectorFor(key), container);
		for (var i = inputs.length - 1; i >= 0; i -= 1) {
			var input = inputs[i];
			if (values.length > i) {
				$(input).val(values[i]);
			}
		}
	};

	var addSpecialRows = function (n) {
		$specialPricesTable.body.empty();
		var rows = [];
		// add special rows
		var showHeader  = false;
		while (rows.length < n) {
			rows.push($specialPricesRow.clone());
			showHeader = true;
		}
		$specialPricesTable.body.append(rows);
		$specialPricesTable.headerRow[showHeader ? 'show':'hide']();
		return rows;
	};


	var populate = function (prices) {
		if (!prices || !prices.values) {
			return;
		}
		prices.special = prices.special || [];
		populateFields('prices.values', $pricesTable, prices.values);
		var rows = addSpecialRows(prices.special.length);
		_.each(prices.special, function (el, idx) {
			populateFields('prices.values', rows[idx], el.values);
			$(selectorFor('prices.special.start'), rows[idx], el.start);
			$(selectorFor('prices.special.end'), rows[idx], el.end);
		});
	};

	var selectorFor = function (key) {
		return 'input[name=' + key.replace(/\./g, '\\.') + ']';
	};

	var gatherValues = function (key, container, wrapInArr) {
		var selector = selectorFor(key);
		var val = $(selector, container)
			.serializeObject()[key];
		if (wrapInArr && typeof val === 'string') {
			val = [val];
		}
		return val;
	};

	var gather = function () {
		var prices = {};
		prices.values = gatherValues('prices.values', $pricesTable, true);
		prices.special = _.map($('tr', $specialPricesTable.body),
			function (tr) {
				return {
					start: gatherValues('prices.special.start', tr, false),
					end: gatherValues('prices.special.end', tr, false),
					values: gatherValues('prices.values', tr, true)
				};
			});
		return prices;
	};

	var getCellRenderer = function (n, forceInput) {
		return function (idx, tr) {
			var $tr = $(tr);
			$('.values', tr).remove();
			var els = [];
			for (var i = n; i > 0; i -= 1) {
				var c;
				if (!forceInput && idx === 0) {
					c = $priceHCell.clone();
					c.text(c.text().replace(/\d+/, i));
				} else {
					c = $priceCell.clone();
					c.attr('name', c.attr('name'));
				}
				els.unshift(c);
			}
			$tr.append(els);
		};
	};

	var renderCols = function (places) {
		var rcp = getCellRenderer(places);
		// render prices
		$('tr', $pricesTable).each(rcp);
		// remove specials
		$specialPricesTable.body.empty();
		$specialPricesTable.headerRow.hide();
		// render special header
		$specialPricesTable.headerRow.each(rcp);
		// render special row
		$specialPricesRow.each(getCellRenderer(places, true));
	};

	var setForPlaces = function (n) {
		var prices = gather();
		renderCols(n, 0);
		populate(prices);
	};

	var notEmpty = function (v, dataType) {
		if (typeof v === 'undefined' || v === null || (v + '').length === 0) {
			var str = 'Empty ' + dataType;
			modalHelper.displayNotification($formModal, str, 'danger');
			throw dataType;
		}
	};

	var mustBeValidDate = function (date) {
		notEmpty(date, 'date');
		if (!dateHelper.isValid(date)) {
			var str = 'Invalid date: ' + date;
			modalHelper.displayNotification($formModal, str, 'danger');
			throw str;
		}
	};

	var mustBeFilledWithFloat = function (values) {
		for (var i = values.length - 1; i >= 0; i -= 1) {
			var v = values[i].replace(/^\s*|\s*$/g, '');
			notEmpty(v, 'price');
			var vf = parseFloat(v);
			if (v !== vf + '') {
				var str = 'Invalid price: ' + v;
				modalHelper.displayNotification($formModal, str, 'danger');
				throw str;
			}
			values[i] = vf;
		}
	};

	var validate = function (prices) {
		mustBeFilledWithFloat(prices.values);
		_.map(prices.special, function (e) {
			mustBeValidDate(e.start);
			mustBeValidDate(e.end);
			mustBeFilledWithFloat(e.values);
		});
	};


	var format = function (data) {
		delete data['prices.values'];
		var prices = gather();
		validate(prices);
		data.prices = prices;
		return data;
	};

	return {
		'populate': populate,
		'setForPlaces': setForPlaces,
		'format': format,
		'init': init
	};
});