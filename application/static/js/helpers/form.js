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

	var updateEntity = function (dst, src) {
		// update the dst attached to the form
		for (var key in src) {
			if (src.hasOwnProperty(key) && key.indexOf('_') !== 0) {
				if (typeof src[key] === 'object') {
					dst[key] = _.isArray(src[key]) ? []:{};
					updateEntity(dst[key], src[key]);
				} else {
					if (_.isArray(dst)) {
						dst.push(src[key]);
					} else {
						dst[key] = src[key];
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
					dialog.alert('Success! Response: ' + result);
				}
			},
			'error' : function (err) {
				if (failCallback) {
					failCallback(err);
				} else {
					try {
						err = JSON.parse(err.responseText);
						dialog.alert(err.message ? err.message:err);
					} catch (e) {
						dialog.alert(err.responseText);
					}
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