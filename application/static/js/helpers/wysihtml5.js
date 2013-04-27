/*global define */
/*global $ */
/*global wysihtml5ParserRules */

define([
	'lib/bootstrap-wysihtml5'
], function () {
	'use strict';
	return {
		'renderTextAreas' : function ($context) {
			$('textarea', $context).each(function (idx, el) {
					var $el = $(el);
					$el.wysihtml5({ parserRules : wysihtml5ParserRules });
				}
			);
		},
		'setValue' : function ($textarea, value) {
			var w5ref = $textarea.data('wysihtml5');
			if (w5ref) {
				w5ref.editor.setValue(value);
			} else {
				$textarea.html(value);
			}
			$textarea.trigger('change');
		}
	};
});