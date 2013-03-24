/*global define */
/*global $ */
/*global window */
/*global setTimeout */

define(
	['elements/notification'],
	function (notification) {
		"use strict";
		var SAFE_SIDE = 2;

		var displayNotification = function ($modal, str, type) {
			var $notification = notification.createNotification(str, type);
			$('.modal-header', $modal).append($notification);
			setTimeout(function () {
				$notification.remove();
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
			'displayNotification' : displayNotification
		};
	}
);