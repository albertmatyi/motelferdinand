/*global define */
/*global $ */

define([
	'lib/jquery'
],
function () {
	'use strict';
	var theSign = '@';
	var dot = '.';
	$('.social .group').one('click', function () {
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
		var email = 'ferdinand' + theSign + 'motel' + dot + 'ro';
		email = '<a href="mailto:' + email + '">' + email + '</a>';
		$('#contactModal .email').html(email);
	});
});