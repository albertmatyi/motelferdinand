/*global define */
/*global window */
/*global _ */
/*global $ */
/*global jQuery */

define([
	'lib/jquery',
	'lib/picasa',
	'lib/slides',
	'elements/fullscreen',
	'elements/progress'
],
function (jq, picasa, slides, fullscreen, progressHelper) {
	'use strict';

	var GALLERIES = [];

	var	fullscreenUrlPreprocessor = function (url, width) {
		return getUrlForSize(url, width, 'w');
	};

	var initControls  = function ($gallery, images) {
		var $btn = $('<span class="fullscreen-btn btn"><i class="icon-fullscreen"></i></span>');
		var $img = $('.picaslides-container', $gallery);
		$btn.insertAfter($img).click(function () {
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
			var glry = $(this);
			var w = glry.width();
			var width = w + 'px';
			var height = w * 3 / 4 + 40 + 'px';
			glry.css('width', width);
			glry.css('height', height);
			GALLERIES.push({element: glry, slideOpts: slideOpts, successCallback: successCallback});
			refresh();
		};
	})(jQuery);

	var refresh = function () {
		if (GALLERIES.length === 0) {
			return;
		}
		var $w = $(window);
		var wTop = $w.scrollTop();
		var wBottom = wTop + $w.height();
		var isInViewport = function ($element) {
			var elTop = $element.position().top;
			var elBottom = elTop + $element.height();
			return (wTop < elBottom && elBottom < wBottom) || (wTop < elTop && elTop < wBottom);
		};
		var notRendered = [];
		for (var i = GALLERIES.length - 1;  i >= 0; i -= 1) {
			var gal = GALLERIES[i];
			if (gal.element.data('loaded') !== 'yes') {
				if (isInViewport(gal.element)) {
					loadImages(gal);
					gal.element.data('loaded', 'yes');
				} else {
					notRendered.push(gal);
				}
			}
		}
		GALLERIES = notRendered;
	};

	var loadImages = function (obj) {
		var glry = obj.element;
		var slideOpts = obj.slideOpts;
		var successCallback = obj.successCallback;
		var user = glry.attr('data-picaslide-username');
		var album = glry.attr('data-picaslide-albumid');
		if (!user || user.length < 3 || !album || album.length < 1) {
			return;
		}
		var w = glry.width();
		var width = w + 'px';
		var height = w * 3 / 4 + 'px';
		progressHelper.show(glry);
		$.picasa.images(user, album, function (images) {
			glry.removeClass('error').addClass('success');
			glry.css('height', 'auto');
			progressHelper.hide();
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
			glry.html(picasaAlbum);
			slideOpts.container = 'picaslides-container';
			slideOpts.paginationClass = 'picaslide-pagination';
			glry.slides(slideOpts);
			addThumbs(glry, images);
			if (successCallback) {
				successCallback.apply(glry, images);
			}
			initControls(glry, images);
			glry.show();
		},
		function () {
			progressHelper.hide();
			glry.addClass('error');
		});
	};

	var addThumbs = function (gallery, images) {
		$('.picaslide-pagination li', gallery).each(function (idx, el) {
			var $el = $(el);
			var url = getUrlForSize(images[idx].url, $el.width());
			$el.css({
				'background-image': 'url(' + url + ')'
			});
		});
	};

	$(window).on('scroll', refresh);
// close the define
});