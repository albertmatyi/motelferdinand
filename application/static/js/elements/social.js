/*global define */
/*global window */
/*global $ */

define([
	'elements/modal',
	'elements/progress',
	'lib/jquery'
],
function (modalHelper, progressHelper) {
	'use strict';
	var AT = '@';
	var DOT = '.';
	var $icons = $('.social .icons');
	var $brand = $('.brand');
	var $arrowContainer = $('.arrow-container');
	var $svg = $('#social-arrow', $arrowContainer);
	var $arrow = $('#svg-arrow', $svg);
	var $arrowHead = $('#svg-arrow-head', $svg);
	var $infoModal = $('#contactModal');
	$infoModal.body = $('.modal-body', $infoModal);

	var drawArrow = function () {
		var scrollTop = $(window).scrollTop();
		var brandPos = $brand.offset();
		var brandH = $brand.outerHeight();
		var brandW = $brand.outerWidth();
		var brandBottom = brandPos.top + brandH - scrollTop;
		var brandMiddle = brandPos.left + brandW / 2;

		var iconsPos = $icons.offset();
		var iconsTop = iconsPos.top - scrollTop;
		var iconsMiddle = iconsPos.left + $icons.outerWidth() / 2;
		var ICONS_DIST = 10, ARROW_WIDTH = 4, ARROW_HEIGHT = 4;
		var svgH = iconsTop - brandBottom - ICONS_DIST;
		var svgW = brandMiddle - iconsMiddle + ARROW_WIDTH;

		$svg.attr('height', svgH);
		$svg.attr('width', svgW);
		$arrowContainer.css({top: brandBottom, left: iconsMiddle - ARROW_WIDTH, position: 'fixed'});

		var p0 = ['M' + ARROW_WIDTH, svgH].join(','); // src
		var p1 = [svgW, -20].join(','); // dst

		var cp0 = ['C' + ARROW_WIDTH, -svgH * 0.5].join(','); // control point 1
		var cp1 = [svgW, svgH * 0.7].join(','); // control point 2

		var path = [p0, cp0, cp1, p1].join(' ');
		$arrow.attr('d', path);

		$arrowHead.attr('d', [
			p0,
			[0, svgH - ICONS_DIST - ARROW_HEIGHT].join(','),
			[ARROW_WIDTH * 2, svgH - ICONS_DIST - ARROW_HEIGHT].join(',')
		].join(' '));
	};

	var addMapAndMail = function () {
		$('#contactModal .map-iframe').prepend(
			'<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" ' +
			'	src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=ferdinand+panzio,+sepsiszentgyorgy&amp;aq=&amp;sll=37.0625,-95.677068&amp;sspn=43.528905,79.013672&amp;ie=UTF8&amp;hq=ferdinand+panzio,+sepsiszentgyorgy&amp;hnear=&amp;radius=15000&amp;ll=45.863611,25.7875&amp;spn=0.009384,0.01929&amp;t=m&amp;z=14&amp;iwloc=A&amp;cid=15223128748669782681&amp;output=embed">' +
			'</iframe>' +
			'<br />' +
			'<small>' +
			'	<a href="https://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=ferdinand+panzio,+sepsiszentgyorgy&amp;aq=&amp;sll=37.0625,-95.677068&amp;sspn=43.528905,79.013672&amp;ie=UTF8&amp;hq=ferdinand+panzio,+sepsiszentgyorgy&amp;hnear=&amp;radius=15000&amp;ll=45.863611,25.7875&amp;spn=0.009384,0.01929&amp;t=m&amp;z=14&amp;iwloc=A&amp;cid=15223128748669782681" ' +
			'		style="color:#0000FF;text-align:left">' +
			'		View Larger Map' +
			'	</a>' +
			'</small>'
		);
		var email = 'ferdinand' + AT + 'motel' + DOT + 'ro';
		email = '<a href="mailto:' + email + '">' + email + '</a>';
		$('#contactModal .email').html(email);
	};

	var toggleMessage = function () {
		$infoModal.toggleClass('info').toggleClass('message');
	};

	var send = function () {
		var name = $('#contact-name', $infoModal).val();
		var email = $('#contact-email', $infoModal).val();
		var message = $('#contact-message', $infoModal).val();
		progressHelper.show($infoModal.body);
		$.post(
			'/mail/send-contact-message',
			{
				'data': JSON.stringify({
					'name': name,
					'email': email,
					'message': message
				})
			}, function (data) {
				toggleMessage();
				modalHelper.displayNotification($infoModal,
					data.message,
					'success');
				progressHelper.hide();
			}, 'json');

	};

	var init = function () {
		$(window).on('resize', drawArrow);
		drawArrow();
		$('.social .group').one('click', addMapAndMail);
		$('.show-send-message', $infoModal).on('click', toggleMessage);
		$('.message-content .back-button', $infoModal).on('click', toggleMessage);
		$('.message-content .send-button', $infoModal).on('click', send);
	};

	var show = function () {
		$('#contactModal').modal('show');
	};

	return {
		'init': init,
		'show': show
	};
});