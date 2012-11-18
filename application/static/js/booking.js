define(
	[
	 	"/static/lib/jquery-1.7.2.min.js"
	],
	function(){
		/**
		 * The jQuery ref to the form to be handled
		 */
		var $form = $('#booking-form');
		/**
		 * The tbody that contains selected rooms
		 */
		var $bookedRooms = $('tbody', $form);
		/**
		 * The modal through which we can add rooms to the 
		 * booking
		 */
		var $addRoomModal = $('#bookingAddRoomModal');
		/**
		 * The select element using which we can select a room
		 */
		var $roomSelect = $('#addRoomBookable', $addRoomModal);
		/**
		 * The select element containing options for quantity
		 */
		var $quantitySelect = $('#addRoomQuantity', $addRoomModal);
		/**
		 * Input that contains the arrival date
		 */
		var $bookFrom = $('#addRoomFrom', $addRoomModal);
		/**
		 * Input containing the departure date 
		 */
		var $bookUntil = $('#addRoomUntil', $addRoomModal);
		/**
		 * The method to be ran when changing a room.
		 * Should update the selectable quantity dropdown
		 */
		$roomSelect.change(function(){
			var qty = $('option:selected', $roomSelect).data().quantity;
			$quantitySelect.html('');
			console.log(qty);
			for (var j = 1; j <= qty; j++) {
				$quantitySelect.append('<option value="'+j+'">'+j+'</option>');
			};
		});

		/**
		 * When we click the addRoomButton, the data from the form should be collected and 
		 * added to the bookedRooms
		 */
		$('#addRoomButton', $addRoomModal).click(function(){
			var idx = ($bookedRooms.children().length);
			$bookedRooms.append('<tr id="BookingEntry'+idx+'">'
				+ '<td>' + (idx+1)+  '</td>'
				+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+']["bookable_id"]" '
			            + 'value="'+$roomSelect.val()+'" />' 
				    + $('option:selected', $roomSelect).text() 
			 	+  '</td>'
				+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+']["quantity"]" '
			            + 'value="'+$quantitySelect.val()+'" />' 
				    + $quantitySelect.val() 
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+']["book_from"]" '
			            + 'value="'+$bookFrom.val()+'" />' 
				    + $bookFrom.val()
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+']["book_until"]" '
						+ 'value="'+$bookUntil.val()+'" />' 
				    + $bookUntil.val()
			 	+  '</td>'
			 	+ '<td> <a href="#" class="btn btn-danger" id="removeBooking'+idx+'Button">'
			 		+ '<i class="icon-remove icon-white"></i>'
			 	+ '</a></td>'
				+ '</tr>');
			/**
			 * Upon clicking the remove button remove the row from the bookedRooms table
			 */
			$('#removeBooking'+idx+'Button', $bookedRooms).click(function(){
				$('#BookingEntry'+idx, $bookedRooms).remove();
				return false;
			});
		});

		return {
			/**
			 * The exposed public method, that adds the booking form to the booking section of the Category
			 * identified by the id
			 */
			showForm: function(categoryId){
				$('#Category'+ categoryId + ' .booking-form-container').append($form);
				var bookables = model.categories.filter(function(el){return el.id == categoryId; })[0].bookables;
				$roomSelect.html('');
				$bookedRooms.html('');
				for (var i = bookables.length - 1; i >= 0; i--) {
					$roomSelect.append('<option value="'+bookables[i].id+'" data-quantity="'+bookables[i].quantity+'">' 
						+ bookables[i].title+'</option>');
				};
				// trigger the populating of the quantities
				$roomSelect.change();
			}
		}
    }
);	