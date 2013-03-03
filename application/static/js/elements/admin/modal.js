/*global define */
/*global $ */
/*global window */

define(
	[],
	function () {
		"use strict";
		var SAFE_SIDE = 2;
		return {
			'init' : function ($context) {
				$('.modal.big-modal', $context).each(function (i, el) {
					var $el = $(el),
						wh = $(window).height(),
						eh = $el.height(),
						marg = -eh / 2,
						hh = $('> .modal-header', $el).outerHeight(true),
						fh = $('> .modal-footer', $el).outerHeight(true);
					$el.css('margin-top', marg + 'px');
					$('> .modal-body', $el).height(eh - (hh + fh) - SAFE_SIDE);
				});
			}
		};
	}
);