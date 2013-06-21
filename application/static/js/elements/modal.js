/*global define */
/*global window */
/*global setTimeout */
/*global $ */

define(
[
	'elements/notification'
],
function (notification) {
	'use strict';
	var SAFE_SIDE = 2;
	var MODAL_HEIGHT_PERC = 0.9;

	var displayNotification = function ($modal, str, type) {
		var $notification = notification.createNotification(str, type);
		$modal.children('.modal-header').append($notification);
		setTimeout(function () {
			$notification.remove();
		}, 5000);
		return $notification;
	};

	var setSize = function ($el) {
		var wh = $(window).height(),
			eh = wh * MODAL_HEIGHT_PERC,
			hh = $('> .modal-header', $el).outerHeight(true),
			fh = $('> .modal-footer', $el).outerHeight(true);
		$('> .modal-body', $el).height(eh - (hh + fh) - SAFE_SIDE);
	};

	var fix = function () {
		$('.modal').appendTo($('body'));
		return this;
	};

	var init = function (el) {
		var $el = el ? $(el):$('.big-modal');
		setSize($el);
		if (!$el.data('boundToResize')) {
			$(window).resize(function () {
				setSize($el);
			});
			$el.data('boundToResize', true);
		}
		return this;
	};

	return {
		'init' : init,
		'displayNotification' : displayNotification,
		'fix' : fix
	};
});