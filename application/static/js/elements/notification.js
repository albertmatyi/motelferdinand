/*global define */
/*global $ */

define(
	[],
	function () {
		'use strict';
		var createNotification = function (str, type, $context) {
			var $notification = $('<div class="alert ' + (type ? 'alert-' + type : '') + '">' +
				'<button type="button" class="close" data-dismiss="alert">&times;</button>'	+
				str	+
				'</div>');
			if ($context) {
				$context.prepend($notification);
			}
			return $notification;
		};

		var remove = function (context) {
			$('.alert', context).remove();
		};

		return {
			'createNotification' : createNotification,
			'remove' : remove
		};
	}
);