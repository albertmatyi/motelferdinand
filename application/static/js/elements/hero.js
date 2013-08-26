/*global define */
/*global model */
/*global window */
/*global $ */

define(['lib/jquery'], function () {
	'use strict';

	var $hero = $('#hero');

	var categoryDirective = {
		'title': {
			'href': function () {
				return '#Category' + this.id;
			},
			'text': function () {
				return this.i18n[model.language].title;
			}
		}
	};

	var init = function () {
		var $w = $(window);
		var wH = $w.height();
		$hero.height(wH);
		var markFirstPage = function () {
			if ($w.scrollTop() < wH - 100) {
				$('body').addClass('on-first-page');
			} else {
				$('body').removeClass('on-first-page');
			}
		};
		$w.on('scroll', markFirstPage);
		markFirstPage();
		$('.nav-list', $hero).render(model.categories, categoryDirective);
	};

	return {
		'init': init
	};
});