/*global define */
/*global $ */
/*global window */

define([
	'lib/jquery'
], function () {
	'use strict';
	var $fsContext = $('#fullscreen-image');

	var images = [];

	/**
	 * The index of the currently viewed image in fullscreen mode
	 */
	var index = -1;

	var URL_PREPROCESSOR;

	$fsContext.click(function () {
		$fsContext.hide();
	});

	$('.next', $fsContext).click(function (event) {
		event.stopImmediatePropagation();
		index += 1;
		if (index >= images.length) {
			index = 0;
		}
		showImages(images, index, URL_PREPROCESSOR);
		return false;
	});

	$('.prev', $fsContext).click(function (event) {
		event.stopImmediatePropagation();
		index -= 1;
		if (index < 0) {
			index = images.length - 1;
		}
		showImages(images, index, URL_PREPROCESSOR);
		return false;
	});

	/**
	 * Shows the images in a fullscreen overlay
	 *
	 * @param imgs The array of images {title: , description: , url: }
	 * @param startIndex
	 */
	var showImages = function (imgs, startIndex, urlPreprocessor) {
		urlPreprocessor = urlPreprocessor || function (url) { return url; };
		URL_PREPROCESSOR = urlPreprocessor;

		index = startIndex || 0;
		images = imgs || [];
		var DATA = images[index];
		var imageURL = DATA.url;

		// information width percent
		var infoWP = 0;
		if (DATA.title && DATA.title.trim() !== '' ||
			DATA.description &&
			DATA.description.trim() !== '') {
			$('h3', $fsContext).html(DATA.title).show();
			$('article', $fsContext).html(DATA.description).show();
			infoWP = 0.2;
		} else {
			$('h3', $fsContext).hide();
			$('article', $fsContext).hide();
			infoWP = 0;
		}
		var oww = $(window).width();
		var windowW = oww * (1 - infoWP);
		var windowH = $(window).height();
		var w = windowW * 0.80;
		var mult = 1;
		if (DATA.width && DATA.width / windowW > DATA.height / windowH) {
			mult = 1 / (DATA.width / windowW);
		} else if (DATA.height) {
			mult = 1 / (DATA.height / windowH);
		}
		w = DATA.width * mult * 0.95;
		var ic = $('.image-container', $fsContext);
		ic.css('left', (oww * infoWP + (windowW - w) / 2) + 'px');
		ic.css('top', ((windowH - w * DATA.height / DATA.width) / 2) + 'px');
		ic.html('<img src="' + urlPreprocessor(imageURL, w) +
			'" alt="' + DATA.title +
			'" title="' + DATA.title +
			'" style="width: ' + w + 'px" />');
		$('.prev, .next', $fsContext).show();
		$fsContext.fadeIn();
	};

	return {
		'showImages' : showImages
	};
});