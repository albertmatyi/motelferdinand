/*global define */
/*global model */
/*global window */
/*global $ */

define(['lib/jquery'], function () {
	'use strict';

	var $hero = $('#hero');

	var categoryDirective = {
		'link': {
			'href': function () {
				return '#Category' + this.id;
			}
		},
		'title': {
			'text': function () {
				return this.i18n[model.language].title;
			}
		}
	};

	var init = function () {
		var $firstCat = $('.category').first();
		var $navbar = $('#navbar');
		var $w = $(window);
		var wH = $w.height();
		$hero.height(wH);

		var origMarginTop = parseInt($firstCat.css('margin-top'), 10);
		var navH = $navbar.height();
		var fixed = true;
		var markFirstPage = function () {
			var st = $w.scrollTop();
			if (st < wH && fixed) {
				$('body').addClass('on-first-page');
				$navbar.css({
					position: 'static'
				});
				$firstCat.css({
					'margin-top': origMarginTop + 'px'
				});
				fixed = false;
			} else if (st >= wH && !fixed) {
				$('body').removeClass('on-first-page');
				$('.category').first().css({

				});
				$firstCat.css({
					'margin-top': origMarginTop + navH + 'px'
				});
				$navbar.css({
					position: 'fixed',
					top: 0
				});
				fixed = true;
			}
		};
		$w.on('scroll', markFirstPage);
		$('.nav-list', $hero).render(model.categories, categoryDirective);
		markFirstPage();
	};

	return {
		'init': init
	};
});