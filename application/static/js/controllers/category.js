define(
[
	'controllers/booking',
	'helpers/fixit2'
],
function(booking, fixit) {
	return {
		init : function() {
			fixit.setup($('.category-info'));
			booking.setup();
		}
	};
});