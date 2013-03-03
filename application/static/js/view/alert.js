/*global define */
/*global $ */

define(
	[],
	function () {
		"use strict";
		var alert = function (str, type, $context) {
			var $alert = $('<div class="alert ' + (type ? 'alert-' + type : '') + '">' +
				'<button type="button" class="close" data-dismiss="alert">&times;</button>'	+
				str	+
				'</div>');
			if ($context) {
				$context.prepend($alert);
			}
			return $alert;
		};
		return {
			'alert' : alert
		};
	}
);