/*global define */
/*global $ */

define(
[ 'lib/jquery' ], function () {
	'use strict';
	var $modal = $('#dialogModal');
	var okCallback = null;
	var $okButton = $('.btn-primary', $modal);
	var $cancelButton = $('.btn.dismiss', $modal);
	var $modalBody = $('.modal-body', $modal);
	var $modalTitle = $('h3', $modal);
	var confirmationDefaultText = $modalBody.text();
	var confirmationDefaultTitle = $modalTitle.text();

	var modalUsed = false;

	$modal.on('hidden', function () {
		modalUsed = false;
	});

	$modal.on('shown', function () {
		$okButton.focus();
	});

	var checkHiddenAndRun = function (method) {
		if (modalUsed) {
			setTimeout(function () { checkHiddenAndRun(method); }, 200);
		} else {
			modalUsed = true;
			method();
		}
	};


	$okButton.click(function () {
		if (okCallback) {
			okCallback();
		}
		hideModal();
	});
	$cancelButton.click(function () {
		hideModal();
	});

	var hideModal = function () {
		okCallback = null;
		$modal.modal('hide');
	};

	var showModal = function ($dialog) {
		var $currentModals = $('.modal.in');
		if ($currentModals.length > 0) {
			$currentModals.one('hidden', function () {
				$dialog.modal('show');
				$dialog.one('hidden', function () {
					if ($currentModals) {
						$currentModals.modal('show');
					}
				});
			}).modal('hide');
		} else {
			$dialog.modal('show');
		}
	};

	var alert = function (content, okCb) {
		checkHiddenAndRun(function () {
			$modalBody.html('');
			$modalTitle.text(content);
			okCallback = okCb;

			$modal.addClass('alert-modal');
			showModal($modal);
		});
		return $modal;
	};

	var confirm = function (content, okCb) {
		checkHiddenAndRun(function () {
			$modalTitle.text(confirmationDefaultTitle);
			content = content || confirmationDefaultText;
			$modalBody.html(content);
			okCallback = okCb;

			$modal.removeClass('alert-modal');
			showModal($modal);
		});
		return $modal;
	};

	return {
		'confirm' : confirm,
		'alert' : alert
	};
});