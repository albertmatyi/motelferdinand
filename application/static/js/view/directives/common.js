/*global define */
/*global $ */
/*global model */

define([
],
function () {
	'use strict';
	return {
		'descriptionDirective' : {
			text : function () {
				return '';
			},
			html : function () {
				return this.i18n[model.language].description;
			}
		},
		'titleDirective' : {
			text : function () {
				return this.i18n[model.language].title;
			}
		},
		'getEntityDirective' : function (type) {
			var dir = {
				text : function (params) {
					$(params.element).data('entity', this);
					return $(params.element).text();
				}
			};
			dir['data-' + type + '-id'] = function () {
					return this.id;
				};
			dir['data-' + type + '-idx'] = function (params) {
					return params.index;
				};
			return dir;
		},
		'prefixDirective' : function (directive, prefix) {
			var nuDir = {};
			for (var key in directive) {
				if (directive.hasOwnProperty(key)) {
					nuDir[prefix + '.' + key] = directive[key];
				}
			}
			return nuDir;
		},
		'option': {
			'value' : {
				'text' : function () {
					return this.value;
				},
				'value' : function () {
					return this.value;
				}
			}
		}
	};
});