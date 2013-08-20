/*global define */
/*global $ */
/*global wysihtml5ParserRules */

define([
	'config',
	'lib/bootstrap-wysihtml5'
], function (config) {
	'use strict';
	return {
		'renderTextAreas' : function ($context) {
			$('textarea.rich', $context).each(function (idx, el) {
					var $el = $(el);
					if (config.RENDER_TEXTEDITOR) {
						$el.wysihtml5({ parserRules : wysihtml5ParserRules, stylesheets: ['static/css/admin/wysihtml5.css'] });
					}
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