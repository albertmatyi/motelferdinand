/*global define */
/*global $ */
/*global window */
/*global setTimeout */

define(
	['view/alert'],
	function (alert) {
		"use strict";
		var SAFE_SIDE = 2;

		var displayAlert = function ($modal, str, type) {
			var $alert = alert.alert(str, type);
			$('.modal-header', $modal).append($alert);
			setTimeout(function () {
				$alert.remove();
			}, 5000);
		};

		var setSize = function ($el) {
			var wh = $(window).height(),
				eh = wh * 0.8,
				hh = $('> .modal-header', $el).outerHeight(true),
				fh = $('> .modal-footer', $el).outerHeight(true);
			$('> .modal-body', $el).height(eh - (hh + fh) - SAFE_SIDE);
		};


		return {
			'init' : function (el) {
				var $el = $(el);
				setSize($el);
				if (!$el.data('boundToResize')) {
					$(window).resize(function () {
						setSize($el);
					});
					$el.data('boundToResize', true);
				}
			},
			'displayAlert' : displayAlert
		};
	}
);