/*global define */
/*global _ */
/*global $ */
/*global jQuery */

define([
	'lib/jquery',
	'lib/picasa',
	'lib/slides',
	'elements/fullscreen'
],
function (jq, picasa, slides, fullscreen) {
	'use strict';

	var	fullscreenUrlPreprocessor = function (url, width) {
		return getUrlForSize(url, width, 'w');
	};

	var initControls  = function ($context, images) {
		var $btn = $('<span class="fullscreen-btn btn"><i class="icon-fullscreen"></i></span>');
		$btn.appendTo($context).click(function () {
			fullscreen.showImages(
				_.map(images, function (el) { delete el.title; return el; }),
				0,
				fullscreenUrlPreprocessor);
		});
	};

	var getUrlForSize = function (url, size, side) {
		side = side || 's';
		size = parseInt(size, 10);
		return url.replace(/(\/)([^\/]+)$/, '$1' + side + size + '/$2');
	};

	(function ($) {
		$.fn.picaslide = function (slideOpts, successCallback) {
			var scope = $(this);
			var user = scope.attr('data-picaslide-username');
			var album = scope.attr('data-picaslide-albumid');
			if (!user || user.length < 3 || !album || album.length < 1) {
				return;
			}
			var w = scope.width();
			var width = w + 'px';
			var height = w * 3 / 4 + 'px';
			console.log(width);
			scope.css('width', width);
			scope.css('height', height);
			$.picasa.images(user, album, function (images) {
				var picasaAlbum = '<div class="picasa-album picaslides-container" style="height: ' + height + '; width: ' + width + ';">\n';
				$.each(images, function (i, element) {
					picasaAlbum += '  <div class="picasa-image" style="width: ' + width + '; height: ' + height + ';' +
					' background-repeat: no-repeat; background-image: url(' +
						getUrlForSize(element.url, Math.max(parseInt(height, 10), parseInt(width, 10))) +
						'); background-size: cover; background-position: center;"' +
					'>\n';
					picasaAlbum += '  </div>\n';
				});
				picasaAlbum += '</div>';
				scope.html(picasaAlbum);
				slideOpts.container = 'picaslides-container';
				slideOpts.paginationClass = 'picaslide-pagination';
				scope.slides(slideOpts);
				if (successCallback) {
					successCallback.apply(scope, images);
				}
				initControls(scope, images);
				scope.show();
			});
		};
	})(jQuery);
// close the define
});