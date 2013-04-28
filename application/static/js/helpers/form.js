/*global define */
/*global $ */
/*global _ */

define(
[
	'lib/jquery',
	'helpers/wysihtml5',
	'elements/dialog'
],
function (jq, wysihtml5, dialog) {
	'use strict';
	var getData = function ($form, exclusion) {
		var inputs = $('input, select, textarea', $form);
		if (exclusion) {
			inputs = inputs.not(exclusion);
		}
		return inputs.serializeObject();
	};

	var updateEntity = function (entity, data) {
		// update the entity attached to the form
		for (var key in data) {
			if (data.hasOwnProperty(key) && key.indexOf('_') !== 0) {
				if (typeof data[key] === 'object') {
					entity[key] = entity[key] || (_.isArray(data[key]) ? []:{});
					updateEntity(entity[key], data[key]);
				} else {
					if (_.isArray(entity)) {
						entity.push(data[key]);
					} else {
						entity[key] = data[key];
					}
				}
			}
		}
	};

	var submitForm = function ($form, action, successCallback, failCallback, dataFormatter) {
		var data = getData($form);
		if (dataFormatter) {
			data = dataFormatter(data);
		}
		submitData(data, action, function (id) {
			var isNew = data.id ? false:true;
			data.id = id;
			var entity = $form.data('entity');
			updateEntity(entity, data);
			if (successCallback) {
				successCallback(entity, isNew);
			}
		}, failCallback);
	};

	var submitData = function (data, action, successCallback, failCallback) {
		$.ajax({
			url : action,
			success : function (result) {
				if (successCallback) {
					successCallback(result.id);
				} else {
					dialog.alert('ERROR' + result);
				}
			},
			'error' : function (err) {
				if (failCallback) {
					failCallback(err);
				} else {
					dialog.alert(err.message ? err.message:err);
				}
			},
			type : 'POST',
			data : { 'data' : JSON.stringify(data) },
			dataType: 'json'
		});
	};

	return {
		/**
		 * Populate the input fields of a form with data
		 */
		'populate' : function ($form, entity) {
			$form.data('entity', entity);
			$('input, select', $form).each(function (idx, el) {
				var $el = $(el);
				var key = $el.attr('name');
				$el.val(entity[key] || '').trigger('change');
			});
			$('textarea', $form).each(function (idx, el) {
				var $el = $(el);
				var key = $el.attr('name');
				wysihtml5.setValue($el, entity[key] || '');
			});
		},
		/**
		 *  Submit a form to a url
		 */
		'submitForm': submitForm
	};
//close the function & define
});