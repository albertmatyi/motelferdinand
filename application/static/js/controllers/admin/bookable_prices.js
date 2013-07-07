/*global define */
/*global $ */
/*global _ */
/*global model */

define([
	'lib/jquery',
	'lib/underscore'
], function () {

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

	var format = function (data) {
		delete data['prices.values'];
		data.prices = gather();
		return data;
	};

	return {
		'populate': populate,
		'setForPlaces': setForPlaces,
		'format': format,
		'init': init
	};
});