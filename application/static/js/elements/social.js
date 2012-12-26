define([
	'lib/jquery'
],
function(){
	$('.social-icons a img').hover(function(ev){
		switch(ev.type){
			case 'mouseenter':
				ev.target.src = ev.target.src.replace(/(_h)?.png/, '_h.png');
			break;
			default:
				ev.target.src = ev.target.src.replace('_h', '');
			break;
		}
	});
});