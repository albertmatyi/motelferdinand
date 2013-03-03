/*global define */
/*global $ */

define(
[ 'lib/jquery' ], function () {
	"use strict";
	var $confirmationModal = $('#confirmationModal');
	var okCallback = null;
	var $confirmationOkBtn = $('.btn-primary', $confirmationModal);
	var $confirmationCancelBtn = $('.btn cancel', $confirmationModal);

	$confirmationOkBtn.click(function () {
		if (okCallback) {
			okCallback();
		}
		$confirmationModal.modal('hide');
		okCallback = null;
	});
	$confirmationCancelBtn.click(function () {
		okCallback = null;
		$confirmationModal.modal('hide');
	});

	return {
		'show': function (okCb) {
			okCallback = okCb;
			$confirmationModal.modal('show');
		}
	};
});