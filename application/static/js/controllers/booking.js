define(
	[
		"helpers/i18n"
	],
	function(i18n){
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
			            + 'name="bookingEntries.'+idx+'.bookable_id" '
			            + 'value="'+$roomSelect.val()+'" />' 
				    + $('option:selected', $roomSelect).text() 
			 	+  '</td>'
				+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.quantity" '
			            + 'value="'+$quantitySelect.val()+'" />' 
				    + $quantitySelect.val() 
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.book_from" '
			            + 'value="'+$bookFrom.val()+'" />' 
				    + $bookFrom.val()
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.book_until" '
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
		var $userFullName = $('input[name="user.full_name"]', $form);
		/**
		 * The input for the email
		 */
		var $userEmail = $('input[name="user.email"]', $form);
		/**
		 * The input for the email
		 */
		var $userPhone = $('input[name="user.phone"]', $form);
		/**
		 * The button used for submitting a booking
		 */
		var $submitBookingButton = $('#submitBookingButton', $form);
		/**
		 *	The table containing the booked rooms
		 */
		var $bookingsTableControls = $('.tableAddControl', $form);

		/**
		 * Shows or hides a tooltip on the given element
		 */
		function setTooltip($item, show){
			show && $item.tooltip({'trigger':'manual'});
			$item.tooltip(show ? 'show':'destroy');
		}
		/**
		 * Does validations, and shows validation messages
		 * @return True if all is ok. False otherwise
		 */
		function validate(){
			var allOk = true;
			var ok = $userFullName.val().match(/[\w -]{3,}/) != null;
			setTooltip($userFullName, !ok);
			allOk &= ok;
			
			ok = $userEmail.val().match(/[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}/) != null;
			setTooltip($userEmail, !ok)
			allOk &= ok;

			ok = $userPhone.val().match(/[\d+\s\-]{5,}/) != null;
			setTooltip($userPhone, !ok)
			allOk &= ok;			
			
			ok = $bookedRooms.children().length > 0;
			setTooltip($bookingsTableControls, !ok);
			allOk &= ok;

			setTooltip($submitBookingButton, !allOk);
			return allOk;
		}
		/**
		 * Do a validation before submitting. If all ok. Submit the form.
		 */
		$submitBookingButton.click(function(){
			// do validation
			// if validation fails, show message
			try{
				var dataOk = validate();
			} catch (e){
				console.log(e);
				dataOk = false;
			} 
			if(dataOk){
				// if all OK send the form
				var data = $form.serialize();
				$.ajax({
					type: 'POST',
					url: '/bookings/',
					data: data,
					success: function(){
						// show success message
						var $controlContainer = $form.parent();
						$controlContainer.prepend('<div class="clearfix alert alert-success">'
						        +'<button type="button" class="close" data-dismiss="alert">×</button>'
						        	+ i18n.translate('Booking successfully saved! Stand by for a confirmation email.')
						        +'</div>')
						// on response hide the form
						$form.appendTo($('body'));
						// show the original button
						$('.showBookingFormButton', $controlContainer).show().text('Book again');
					}					
				});
			}
			// block the default behavior
			return false;
		});

		/**
		 * The exposed public method, that adds the booking form to the booking section of the Category
		 * identified by the id
		 */
		var showForm = function(categoryId){
			var $formCont = $('#Category'+ categoryId + ' .booking-controls');
			$('.alert', $formCont).remove();
			$formCont.append($form);
			
			var bookables = model.db.category[categoryId].bookables;
			$roomSelect.html('');
			$bookedRooms.html('');
			for (var i = bookables.length - 1; i >= 0; i--) {
				$roomSelect.append('<option value="'+bookables[i].id+'" data-quantity="'+bookables[i].quantity+'">' 
					+ bookables[i].i18n[model.language].title+'</option>');
			};
			// trigger the populating of the quantities
			$roomSelect.change();
			var d = new Date();
			$bookFrom.val(d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear());
			d.setDate(d.getDate()+1);
			$bookUntil.val(d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear());
		};

		return {
			'setup':function(categories){
				if(typeof(categories) == "undefined"){
					categories = model.categories;
				}
				for (var i = categories.length - 1; i >= 0; i--) {
					$btn = $('#Category'+categories[i].id + ' .booking-btn');
					$btn.data('categoryId',categories[i].id);
					$btn.click(function(){
						var categoryId = $(this).data('categoryId');
						showForm(categoryId);
						$(this).hide();
						return false;
					});
				};
				
			},
			'reset':function(){
				$form.remove();
				$('.booking-btn').show();
			}
		}
    }
);	