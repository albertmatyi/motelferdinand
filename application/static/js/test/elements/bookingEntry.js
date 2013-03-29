/*global define */
/*global $ */
define(
[
], function() {
	"use strict";
	var SELECTOR = '#bookingEntryAddModal';
	var $modal = $(SELECTOR);
	var $fromField = $('#addRoomFrom', $modal);
	var $untilField = $('#addRoomUntil', $modal);
	var $addButton = $('.btn-primary', $modal);

	var fillForm = function (t, bookableTitle, nrOfRooms, fromDate, untilDate) {
		t.l('Fill Booking Entry form');
		t.l('Fill from date').setValue($fromField, fromDate);
		t.l('Fill until date').setValue($untilField, untilDate);
		return this;
	};

	var submit = function (t) {
		t.l('Submit Booking Entry Form').click($addButton);
		return this;
	};

	return {
		'selector' : SELECTOR,
		'fillForm' : fillForm,
		'submit' : submit
	};
});