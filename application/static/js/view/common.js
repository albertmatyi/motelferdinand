/*global define */
/*global $ */

define(
[
	'helpers/picaslide'
], function () {
	'use strict';
	return {
		'renderContentGallery' : function (selector) {
			$(selector).each(function (idx, el) {
				var $el = $(el);
				$el.picaslide({pause: 5000, hoverPause: true, slideSpeed: 850});
			});
		}
	};
});