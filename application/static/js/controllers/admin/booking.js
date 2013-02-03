define(
[	
	'lib/transparency',
	'view/directives/admin/booking',
	'view/directives/admin/bookingDetails',
	'helpers/i18n'
	// ,'lib/jquery-ui'
],
function(transp, bookingsDirective, bookingDetailsDirective, i18n, jqyui){
	var $bookingsModal = $('#adminBookingsModal');
	var $bookingDetails = $('.bookingDetails', $bookingsModal);
	var $bookingsButton = $('#adminBookingsButton');
	var $table = $('.bookings-table > tbody');

	var render = function(){
		rendered = true;
		$('.bookings-table > tbody', $bookingsModal).render(model.bookings, bookingsDirective);

		$('tr', $table).click(function(){
				$('#Booking'+$bookingDetails.data('bookingId'), $bookingsModal).show();
				var $row = $(this);
				$bookingDetails.hide();//('fade', 100, function(){
					var booking = model.db.booking[$row.data('bookingId')];
					$bookingDetails.data('bookingId', booking.id);
					$bookingDetails.render(booking, bookingDetailsDirective);
					var idx = $row.index();
					$row.after($bookingDetails);
					$row.hide();
					$bookingDetails.show();//('fade', 300);
				// });
		});
		$('#closeBookingDetails', $bookingDetails).click(function(){
			$('#Booking'+$bookingDetails.data('bookingId'), $bookingsModal).show();
			$bookingDetails.hide();
		});
		$('#deleteBooking', $bookingDetails).click(function(){
			if(confirm(i18n.translate('Are you sure you wish to delete the booking?'))){
				// TODO backend call
				$bookingDetails.data('bookingId', -1);
				$bookingDetails.hide();
			}
		});
	}
	var $badge = $('.badge', $bookingsButton);

	$badge.text(model.bookings.reduce(function (sum, el){
		return sum + (el.accepted === true ? 0:1);
	}, 0));

	var rendered = false;
	
	$bookingsButton.click(function(){
		if(!rendered){
			render();
		}
		$bookingsModal.modal('show');
	});
//close the function & define
});