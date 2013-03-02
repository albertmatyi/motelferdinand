define(
	[
		'helpers/i18n',
		'helpers/tooltip',
		'controllers/booking_entry'
	],
	function(i18n, tooltip, bookingEntry){
		
		/**
		 * The jQuery ref to the form to be handled
		 */
		var $form = $('#booking-form');
		/**
		 * The tbody that contains selected rooms
		 */
		var $bookedRooms = $('tbody', $form);

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
		 * Does validations, and shows validation messages
		 * @return True if all is ok. False otherwise
		 */
		function validate(){
			var allOk = true;
			var ok = $userFullName.val().match(/[\w -]{3,}/) != null;
			tooltip.set($userFullName, !ok);
			allOk &= ok;
			
			ok = $userEmail.val().match(/[\w\.\-_]{1,}@([\w\-_]+.){1,}\w{3,5}/) != null;
			tooltip.set($userEmail, !ok)
			allOk &= ok;

			ok = $userPhone.val().match(/[\d+\s\-]{5,}/) != null;
			tooltip.set($userPhone, !ok)
			allOk &= ok;			
			
			ok = $bookedRooms.children().length > 0;
			tooltip.set($bookingsTableControls, !ok);
			allOk &= ok;

			tooltip.set($submitBookingButton, !allOk);
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
					dataType: 'json',
					success: function(data){
						// show success message
						var $controlContainer = $form.parent();
						var message = '<div class="clearfix alert alert-'+(data.success === true ? 'success':'error')+'">'
						        +'<button type="button" class="close" data-dismiss="alert">×</button>'
						        	+ data.message
						        +'</div>';
						if(data.success === true){
							$controlContainer.prepend(message);
						}else{
							$submitBookingButton.before(message);
						}
						// on response hide the form
						if(data.success){
							$form.appendTo($('body'));
							// show the original button
							$('.showBookingFormButton', $controlContainer).show().text('Book again');
						}
					}					
				});
			}
			// block the default behavior
			return false;
		});

		var entryAdded = function(entry){
			var idx = ($bookedRooms.children().length);
			$bookedRooms.append('<tr id="BookingEntry'+idx+'">'
				+ '<td>' + (idx+1)+  '</td>'
				+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.bookable_id" '
			            + 'value="'+entry.id+'" />' 
				    + entry.title
			 	+  '</td>'
				+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.quantity" '
			            + 'value="'+entry.quantity+'" />' 

				    + entry.quantity
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.book_from" '
			            + 'value="'+entry.from+'" />' 
				    + entry.from
			 	+  '</td>'
			 	+ '<td> <input type="hidden" '
			            + 'name="bookingEntries.'+idx+'.book_until" '
						+ 'value="'+entry.until+'" />' 
				    + entry.until
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
		};

		/**
		 * The exposed public method, that adds the booking form to the booking section of the Category
		 * identified by the id
		 */
		var showForm = function(categoryId){
			var $formCont = $('#Category'+ categoryId + ' .booking-controls');
			$('.alert', $formCont).remove();
			$formCont.append($form);
			
			var bookables = model.db.category[categoryId].bookables;
			$bookedRooms.html('');
			bookingEntry.init(bookables, entryAdded);
		};
		/**
		 * Hide all tooltips when initializing booking entry modal
		 */
		$('#bookingAddRoomModalTrigger', $form).click(function(){
			tooltip.hideAll();
		});

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