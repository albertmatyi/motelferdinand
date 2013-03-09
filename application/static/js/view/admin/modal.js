/*global define */
/*global $ */
/*global window */

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


		return {
			'init' : function (el) {
				var $el = $(el),
					wh = $(window).height(),
					eh = wh * 0.8,
					marg = -eh / 2,
					hh = $('> .modal-header', $el).outerHeight(true),
					fh = $('> .modal-footer', $el).outerHeight(true);
				// $el.css('margin-top', marg + 'px');
				// $el.height(eh);
				$('> .modal-body', $el).height(eh - (hh + fh) - SAFE_SIDE);
			}, 
			'displayAlert' : displayAlert
		};
	}
);