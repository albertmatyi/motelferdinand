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
	var $infoModal = $('#contactModal');
	$infoModal.body = $('.modal-body', $infoModal);

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
		var email = 'fp' + AT + 'zoltur' + DOT + 'ro';
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