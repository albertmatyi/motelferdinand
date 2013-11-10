/*global define */
/*global $ */
/*global window */

define([
	'lib/jquery'
], function () {
	var bgBaseURL = '/static/img/bgs/';
	var contentPositions;
	var prevIdx = -1;
	var prevVpos = -1;

	var getCatIdx = function (scrollTop) {
		var i = 0;
		while (i < contentPositions.length && contentPositions[i].top < scrollTop) {
			i += 1;
		}
		return i === contentPositions.length ? contentPositions.length - 1:i;
	};

	var calcBg1 = function (force, scrollTopOverride) {
		if (force !== true && $('body.on-first-page').length > 0) {
			return;
		}
		var $w = $(window);
		var wh = $w.height();
		var st = scrollTopOverride || $w.scrollTop();
		var idx = getCatIdx(st);
		var vpos = parseInt((contentPositions[idx].top - wh - st) / 3, 10);
		var imgIdx = idx % 8 + 1;
		$('#body-bg').css({
			'background-image': 'url(' + bgBaseURL + imgIdx + '.jpg)',
			'background-position': '50% ' + vpos + 'px'
		});
	};

	var isIn = function (val, start, end) {
		return start < val && val < end;
	};

	var findIndex = function (wtop, wbottom, startIdx, endIdx) {
		if (startIdx === endIdx) {
			return -1;
		}
		var idx = parseInt((startIdx + endIdx) / 2, 10);
		var cpos = contentPositions[idx];
		if (isIn(cpos.top, wtop, wbottom)) {
			return idx;
		} else if (isIn(cpos.bottom, wtop, wbottom)) {
			return Math.min(idx + 1, contentPositions.length - 1);
		} else {
			if (cpos.top > wbottom) {
				return findIndex(wtop, wbottom, startIdx, idx);
			} else {
				return findIndex(wtop, wbottom, idx, endIdx);
			}
		}
	};

	var calcBg2 = function (force, scrollTopOverride) {
		if (force !== true && $('body.on-first-page').length > 0) {
			return;
		}
		var $w = $(window);
		var wh = $w.height();
		var wtop = scrollTopOverride || $w.scrollTop();
		var wbottom = wtop + wh;

		var idx = -1;
		idx = findIndex(wtop, wbottom, 0, contentPositions.length);
		if (idx === -1) {
			return;
		}
		var vpos = parseInt((contentPositions[idx].top - wh - wtop) / 3, 10);
		var css = {};
		var set = '';
		if (vpos !== prevVpos) {
			css['background-position'] = '50% ' + vpos + 'px';
			prevVpos = vpos;
			set += 'pos ';
		}
		if (idx !== prevIdx) {
			var imgIdx = idx % 8 + 1;
			css['background-image'] = 'url(' + bgBaseURL + imgIdx + '.jpg)';
			prevIdx = idx;
			set += 'bg ';
		}
		if (set !== '') {
			console.log('setting: ' + set);
			$('#body-bg').css(css);
		}
	};

	var calcBg = calcBg2;

	var setup = function (selector) {
		contentPositions = [];
		$(selector).each(function (idx, el) {
			var $el = $(el);
			var top = $el.offset().top;
			var bottom = top + $el.height();
			contentPositions.push({top: top, bottom: bottom});
		});
		$(window).on('scroll', calcBg);
		calcBg(true, $('#hero').height());
	};

	return {
		'setup': setup
	};
});