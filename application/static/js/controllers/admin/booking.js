define(
[
	'view/directives/admin/booking'
],
function(directive){
	var $bookingsModal = $('#adminBookingsModal');

	var $bookingsButton = $('#adminBookingsButton');

	$('.bookings-table > tbody', $bookingsModal).render(model.bookings, directive);

	var $badge = $('.badge', $bookingsButton);

	$badge.text(model.bookings.reduce(function (sum, el){
		return sum + (el.accepted === true ? 0:1);
	}, 0));
	
	$bookingsButton.click(function(){
		$bookingsModal.modal('show');
	});
//close the function & define
});