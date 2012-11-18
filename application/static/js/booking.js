define(
	[
	 	"/static/lib/jquery-1.7.2.min.js"
	],
	function(){
		var $formContainer = $('#booking-form');
		/**
		 * The jQuery ref to the form to be handled
		 */
		var $form = $('form', $formContainer);
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
			            + 'name="BookingEntry['+idx+'][bookable_id]" '
			            + 'value="'+$roomSelect.val()+'" />' 
				    + $('option:selected', $roomSelect).text() 
			 	+  '</td>'
				+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+'][quantity]" '
			            + 'value="'+$quantitySelect.val()+'" />' 
				    + $quantitySelect.val() 
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+'][book_from]" '
			            + 'value="'+$bookFrom.val()+'" />' 
				    + $bookFrom.val()
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="BookingEntry['+idx+'][book_until]" '
						+ 'value="'+$bookUntil.val()+'" />' 
				    + $bookUntil.val()
			 	+  '</td>'
			 	+ '<td> <a href="#" class="btn btn-danger" id="removeBooking'+idx+'Button" title="Remove entry">'
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
		/**
		 * The input for the username
		 */
		var $userFullName = $('input[name="User-full_name"]', $form);
		/**
		 * The input for the email
		 */
		var $userEmail = $('input[name="User-email"]', $form);
		/**
		 * The button used for submitting a booking
		 */
		var $submitBookingButton = $('#submitBookingButton', $form);
		/**
		 * Does validations, and shows validation messages
		 * @return True if all is ok. False otherwise
		 */
		function validate(){
			var ok = true;
			if($userFullName.val().match(/[\w -]{3,}/) == null){
				$userFullName.tooltip('show');
				ok = false;
			}else{
				$userFullName.tooltip('hide');
			}
			if($userEmail.val().match(/[\w.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}/) == null){
				$userEmail.tooltip('show');
				ok = false;
			}else{
				$userEmail.tooltip('hide');
			}
			var $tc = $('.tableAddControl', $form);
			if($bookedRooms.children().length < 1){
				$tc.tooltip('show');
				ok = false;
			}else{
				$tc.tooltip('hide');
			}
			$submitBookingButton.tooltip(!ok ? 'show':'hide');
			return ok;
		}

		/**
		 * Do a validation before submitting. If all ok. Submit the form.
		 */
		$submitBookingButton.click(function(){
			// do validation
			// if validation fails, show message
			var dataOk = validate();
			if(dataOk){
				// if all OK send the form
				var data = $form.serialize();
				$.ajax({
					type: 'POST',
					url: '/bookings/',
					data: data,
					success: function(){
						// show success message
						var $controlContainer = $formContainer.parent().parent();
						$controlContainer.append('<div class="alert alert-success">'
						        +'<button type="button" class="close" data-dismiss="alert">×</button>'
						        	+'Booking successfully saved! Stand by for a confirmation email.'
						        +'</div>')
						// on response hide the form
						$formContainer.appentTo($('body'));
						// show the original button
						$('.showBookingFormButton', $controlContainer).show();
					}					
				});
			}
			// block the default behavior
			return false;
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
				var d = new Date();
				$bookFrom.val(d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear());
				d.setDate(d.getDate()+1);
				$bookUntil.val(d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear());
			}
		}
    }
);	