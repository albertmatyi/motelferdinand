define(
	[
	 	"/static/lib/jquery-1.7.2.min.js"
	],
	function(){
		/**
		 * The jQuery ref to the form to be handled
		 */
		$form = $('#booking-form');
		/**
		 * The tbody that contains selected rooms
		 */
		$bookedItems = $('tbody', $form);
		/**
		 * The modal through which we can add rooms to the 
		 * booking
		 */
		$addRoomModal = $('#bookingAddRoomModal');
		/**
		 * The select element using which we can select a room
		 */
		$roomSelect = $('#addRoomBookable', $addRoomModal);
		$quantitySelect = $('#addRoomQuantity', $addRoomModal);
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
		 * added to the bookedItems
		 */
		$('#addRoomButton', $form).click(function(){

		});

		return {
			/**
			 * The exposed public method, that adds the booking form to the booking section of the Category
			 * identified by the id
			 */
			showForm: function(categoryId){
				$('#Category'+ categoryId + ' .booking-form-container').append($form);
				bookables = model.categories.filter(function(el){return el.id == categoryId; })[0].bookables;
				$roomSelect.html('');
				$bookedItems.html('');
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