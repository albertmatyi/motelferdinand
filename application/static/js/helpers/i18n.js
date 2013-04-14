/*global define */
/*global $ */
/*global model */

define(
[
	'helpers/form',
	'helpers/wysihtml5',
	'lib/bootstrap'
],
function (formHelper, wysihtml5) {
	'use strict';
	var SEPARATOR = '-';
	var PREFIX = 'i18n-';

	var formatI18nData = function (data) {
		data.i18n = {};
		for (var key in data) {
			if (data.hasOwnProperty(key) && key.indexOf(PREFIX) === 0) {
				var keys = key.split('-');
				data.i18n[keys[1]] = data.i18n[keys[1]] || {};
				data.i18n[keys[1]][keys[2]] = data[key];
				delete data[key];
			}
		}
		return data;
	};


	var submitForm = function ($form, action, successCallback, failCallback) {
		// submit
		formHelper.submitForm($form, action, successCallback, failCallback, formatI18nData);
	};

	return {
		/**
		 * Used for static string translation on the client side.
		 * defs can be found in si18n.translations_js
		 */
		translate: function (what, langId) {
			if (!langId) {
				langId = model.language;
			}
			if (model.si18n[langId] && model.si18n[langId][what]) {
				return model.si18n[langId][what];
			}
			return 'translations_js.' + langId + '.' + what;

		},
		/**
		 * Populates rendered input fields with data from a given entity.
		 * The entity should contain a correctly inited i18n field.
		 * The directives should be a dictionary with id-valueKey pairs
		 */
		populateForm: function ($form, entity) {
			// populate simple fields
			formHelper.populate($form, entity);

			// populate i18n fields
			for (var i = 0; i < model.languages.length; i += 1) {
				var langId = model.languages[i].lang_id;
				if (entity.i18n) {
					for (var field in entity.i18n[langId]) {
						if (entity.i18n[langId].hasOwnProperty(field)) {
							var tmpId = '[name="' + PREFIX + langId + SEPARATOR + field + '"]';
							var inp = $('input' + tmpId + ',select' + tmpId, $form);
							var value = entity.i18n[langId][field];
							if (inp.length > 0) {
								inp.val(value);
							} else {
								wysihtml5.setValue($('textarea' + tmpId, $form), value);
							}
						}
					}
				}
			}
		},

		/**
		 * Submits a form using the formHelper and
		 * formats collected i18ned data to conform with the original
		 * object
		 */
		'submitForm' : submitForm,
		/**
		 * Multiplies tabs with inputs for i18n support
		 */
		renderLanguageTabs: function ($context, TAB_ID_BASE) {
			var formTabNavDirectives = {
				'lang_id' : {
					text: function () {
						return this.name;
					},
					href: function (params) {
						$(params.element).click(function () {
							$(this).tab('show');
						});
						return '#' + TAB_ID_BASE + this.lang_id;
					}
				}
			};
			var formTabDirectives = {
				'lang_id' : {
					html: function (params) {
						var langId = this.lang_id;
						$('input, textarea', params.element).each(function (idx, el) {
							var $el = $(el);
							$el.attr('name', PREFIX + langId + SEPARATOR + $el.attr('name'));
						});
						return '';
					},
					text: function () {
						return '';
					},
					id: function () {
						return TAB_ID_BASE + this.lang_id;
					}
				}
			};

			$('.nav-tabs', $context).render(model.languages, formTabNavDirectives);
			$('.tab-content', $context).render(model.languages, formTabDirectives);
			$('.nav-tabs a[href$=' + model.language + ']', $context).tab('show');
			wysihtml5.renderTextAreas($context);
		}
	};
//close the function & define
});