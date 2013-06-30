/*global define */
/*global $ */
/*global _ */

define(['lib/jquery', 'lib/underscore'], function () {

	var PROPS = {};

	var $settingsButton = $('#adminSettingsButton');
	var $modal = $('#adminSettingsModal');
	$modal.props = $('tbody', $modal);
	$modal.tfoot =  $('tfoot', $modal);
	$modal.editor = $('tfoot tr', $modal);
	$modal.editor.textarea = $('textarea', $modal.editor);
	$modal.editor.saveButton = $('.btn.btn-primary', $modal.editor);
	$modal.editor.cancelButton = $('.btn.btn-link', $modal.editor);

	var uc2Char = function (match, p1) {
		return String.fromCharCode(parseInt(p1, 16));
	};

	var loadSettings = function (callback) {
		$.getJSON('/admin/props/', function (data) {
			PROPS = data;
			for (var i = PROPS.length - 1; i >= 0; i -= 1) {
				PROPS[i].value = PROPS[i].value.replace(/\\u([0-9a-f]{4})/g, uc2Char);
				var val = PROPS[i].value;
				PROPS[i].shortValue = shorten(val);
			}
			PROPS.sort(function (a, b) {
				return a.kkey < b.kkey ? -1:1;
			});
			callback();
		});
	};

	var shorten = function (val) {
		return val.length > 40 ? val.substr(0, 40) + '...':val;
	};

	var showSettings = function () {
		$modal.modal('show');
		loadSettings(function () {

			$modal.props.render(PROPS);
		});
	};

	var rowClickHandler = function () {
		var key = $('.key', this).text();
		$(this).after($modal.editor);
		var prop = getProp(key);
		$modal.editor.textarea.val(prop.value);
		$modal.editor.textarea.data('current-prop', prop);
	};

	var getProp = function (key) {
		return _.filter(PROPS, function (el) {
			return el.kkey === key;
		}).pop();
	};

	var saveProp = function () {
		var prop = $modal.editor.textarea.data('current-prop');
		var newVal = $modal.editor.textarea.val().replace(/(^\s*)|(\s*$)/g, '');
		$.post('/admin/props/' + prop.kkey, {'data': newVal}, function (data) {
			prop.value = newVal;
			$('tr:contains(' + prop.kkey + ') .value').text(shorten(data.value));
			closeEditor();
		}, 'json');
	};

	var closeEditor = function () {
		$modal.tfoot.append($modal.editor);
	};

	var init = function () {
		$settingsButton.on('click', showSettings);
		$modal.props.on('click', 'tr:not(.prop-editor)', rowClickHandler);
		$modal.editor.saveButton.on('click', saveProp);
		$modal.editor.cancelButton.on('click', closeEditor);
	};

	return {
		'init': init,
		'show': showSettings
	};
});