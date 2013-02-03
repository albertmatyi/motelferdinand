define(
[	
	'lib/transparency',
	'view/directives/admin/booking',
	'view/directives/admin/bookingDetails',
	'helpers/i18n',
	'helpers/transparency'
],
function(transp, bookingsDirective, bookingDetailsDirective, i18n, transparency){
	var $bookingsModal = $('#adminBookingsModal');
	var $bookingDetails = $('.bookingDetails', $bookingsModal);
	var $bookingsButton = $('#adminBookingsButton');
	var $table = $('.bookings-table > tbody', $bookingsModal);
	var $ftr = $('.bookings-table > tfoot', $bookingsModal)
	var buttonsInitialized = false;


	var render = function(force){
		if(rendered && !force){
			return;
		}
		rendered = true;
		$('.bookings-table > tbody', $bookingsModal).render(model.bookings, bookingsDirective);

		$('tr', $table).click(function(){
				$('#Booking'+$bookingDetails.data('bookingId'), $bookingsModal).show();
				var $row = $(this);
				$bookingDetails.hide();
				var booking = model.db.booking[$row.data('bookingId')];
				$bookingDetails.data('bookingId', booking.id);
				$bookingDetails.render(booking, bookingDetailsDirective);
				var idx = $row.index();
				$row.after($bookingDetails);
				$row.hide();
				$bookingDetails.show();
		});
	}

	var hideDetails = function(){
		$bookingDetails.hide();
		$bookingDetails.appendTo($ftr);
	};

	var initButtons = function (){
		if(!buttonsInitialized){
			$('#acceptBooking', $bookingDetails).click(function(){
				if(confirm(i18n.translate('Are you sure you wish to accept?\n Once you accept, you can no more undo it, and the client will be notified.'))){
					var bk = model.db.booking[$bookingDetails.data('bookingId')];
					//TODO backend call
					bk.accepted = "True";
					var $row = $('#Booking'+bk.id);
					$row = transparency.render($row, bk, bookingsDirective);
					$bookingDetails.before($row);
					$bookingDetails.render(bk, bookingDetailsDirective);
				}
			});
			$('#markAsPaid', $bookingDetails).click(function(){
				var bk = model.db.booking[$bookingDetails.data('bookingId')];
				//TODO backend call
				bk.paid = bk.paid === "True" ? "False":"True";
				var $row = $('#Booking'+bk.id);
				$row = transparency.render($row, bk, bookingsDirective);
				$bookingDetails.before($row);
				$bookingDetails.render(bk, bookingDetailsDirective);
			});
			$('#closeBookingDetails', $bookingDetails).click(function(){
				$('#Booking'+$bookingDetails.data('bookingId'), $bookingsModal).show();
				hideDetails();
			});
			$('#deleteBooking', $bookingDetails).click(function(){
				if(confirm(i18n.translate('Are you sure you wish to delete the booking?'))){
					var bookingId = $bookingDetails.data('bookingId');
					//TODO backend call
					delete model.db.booking[bookingId];
					$bookingDetails.data('bookingId', -1);
					hideDetails();
					render(true);
				}
			});
			buttonsInitialized = true;
		}
	}
	var $badge = $('.badge', $bookingsButton);

	$badge.text(model.bookings.reduce(function (sum, el){
		return sum + (el.accepted === true ? 0:1);
	}, 0));

	var rendered = false;
	
	$bookingsButton.click(function(){
		render(false);
		initButtons();
		$bookingsModal.modal('show');
	});
//close the function & define
});