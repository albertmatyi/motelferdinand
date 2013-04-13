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

	var checkHiddenAndRun = function (method) {
		if (modalUsed) {
			// if (typeof console !== 'undefined' && console.info) { console.log('Trying to show dialog, but there is already one active. Posponing...'); }
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

	// okCallback = okCb || function () { if (typeof console !== 'undefined' && console.log) { console.log('alert: ' + content); } };
	// window.aalert = alert;
	// aalert('hello'); aalert('world'); aalert('damn'); aalert('yo'); aalert('mama'); aalert('is');
	// window.cconfirm =  confirm;
	// cconfirm('hello'); cconfirm('world'); cconfirm('damn'); cconfirm('yo'); cconfirm('mama'); cconfirm('is');
	// cconfirm('hello');aalert('hello'); cconfirm('world');  aalert('world'); cconfirm('damn'); aalert('damn'); cconfirm('yo'); aalert('yo'); cconfirm('mama'); aalert('mama'); cconfirm('is');aalert('is');

	return {
		'confirm' : confirm,
		'alert' : alert
	};
});