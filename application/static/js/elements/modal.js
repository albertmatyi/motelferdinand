/*global define */
/*global window */
/*global setTimeout */
/*global $ */
/*global _ */

define(
[
	'elements/notification',
	'lib/jquery',
	'lib/underscore'
],
function (notification) {
	'use strict';
	var SAFE_SIDE = 2;
	var MODAL_HEIGHT_PERC = 0.9;
	var REMOVE_TIMEOUT = 5000;

	var setNotificationsContainerWidth = function ($modalHeader) {
		var occupiedW = _.reduce(
			_.map(
				$modalHeader.children()
					.filter(':visible')
					.not('.notifications'),
				function (el) {
					return $(el).outerWidth(true);
				}
			), function (total, w) { return total + w; }, 0);
		var availableW = $modalHeader.width();
		$('.notifications', $modalHeader).width(availableW - occupiedW - SAFE_SIDE);
	};

	var displayNotification = function ($modal, str, type) {
		var $notification = notification.createNotification(str, type);
		var $modalHeader = $('.modal-header:visible', $modal);

		setNotificationsContainerWidth($modalHeader);

		$('.notifications', $modalHeader).append($notification);
		setTimeout(function () {
			$notification.remove();
			var $container = $('.notifications', $modalHeader);
			if ($container.children().length === 0) {
				$container.width('auto');
			}
		}, REMOVE_TIMEOUT);
		return $notification;
	};

	var setSize = function ($modal) {
		var wh = $(window).height(),
			eh = wh * MODAL_HEIGHT_PERC,
			hh = $('> .modal-header', $modal).outerHeight(true),
			fh = $('> .modal-footer', $modal).outerHeight(true);
		$('> .modal-body', $modal).height(eh - (hh + fh) - SAFE_SIDE);
	};

	var fix = function () {
		$('.modal').appendTo($('body'));
		return this;
	};

	var init = function (el) {
		var $modal = el ? $(el):$('.big-modal');
		setSize($modal);
		if (!$modal.data('boundToResize')) {
			$(window).resize(function () {
				setSize($modal);
			});
			$modal.data('boundToResize', true);
		}
		return this;
	};

	return {
		'init' : init,
		'displayNotification' : displayNotification,
		'fix' : fix
	};
});