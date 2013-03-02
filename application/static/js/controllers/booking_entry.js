define(['helpers/date', 'helpers/tooltip'],
	function(date, tooltip){
		var DATE_VALIDATOR = {'isValid':function($item){
			var valid = date.isValid($item.val());
			tooltip.set($item, !valid);
			return valid;
		}};

		var BOOKING_DATE_VALIDATOR = {'isValid':function($bookFrom, $bookUntil){
			if(!DATE_VALIDATOR.isValid($bookFrom) || !DATE_VALIDATOR.isValid($bookUntil)){
				return false;
			};			
			var startD = date.toDate($bookFrom.val());
			var endD = date.toDate($bookUntil.val());
			var valid = startD < endD;
			tooltip.set($bookUntil, !valid);
			var yestd = new Date();
			yestd.setDate(yestd.getDate()-1);
			var valid2 = yestd < startD;
			tooltip.set($bookFrom, !valid2);
			return valid && valid2;
		}};

		/**
		 *  The callback that is set at each initialization
		 */
		var entryAddedCallback = function(entry){};

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

		$('.cancel-btn', $addRoomModal).click(function(){
			tooltip.hideAll();
		});

		/**
		 * When we click the addRoomButton, the data from the form should be collected and 
		 * added to the bookedRooms table
		 */
		$('#addRoomButton', $addRoomModal).click(function(event){
			var valid = BOOKING_DATE_VALIDATOR.isValid($bookFrom, $bookUntil);
			
			if(valid){
				entryAddedCallback({
					'id' : $roomSelect.val(),
					'title' : $('option:selected', $roomSelect).text(),
					'quantity' : $quantitySelect.val(),
					'from' : $bookFrom.val(),
					'until': $bookUntil.val()
				});
				return true;
			} else {
				event.stopImmediatePropagation();
				return false;
			}
		});

		/**
		 *	Initializes the add room modal
		 */
		var initAddRoomModal = function(bookables, addedCallback){
			$roomSelect.html('');
			
			for (var i = bookables.length - 1; i >= 0; i--) {
				$roomSelect.append('<option value="'+bookables[i].id+'" data-quantity="'+bookables[i].quantity+'">' 
					+ bookables[i].i18n[model.language].title+'</option>');
			};
			// trigger the populating of the quantities
			$roomSelect.change();
			var d = new Date();

			$bookFrom.val(date.toStr(d));
			d.setDate(d.getDate()+1);
			$bookUntil.val(date.toStr(d));
			//set the callback
			entryAddedCallback = addedCallback ? addedCallback:function(entry){};
		};
		return {
			'init' : initAddRoomModal
		};
	}
);