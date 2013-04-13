/*global define */
/*global $ */

define(
[
    'helpers/i18n',
    'elements/dialog'
],
function (i18n, dialog) {
    'use strict';
    var getDeleteHandler = function (delURL, deleteCallback) {
        return function () {
            dialog.confirm(
                i18n.translate('Are you sure you wish to delete?'),
                function () {
                    $.ajax({
                        'type': 'POST',
                        'url': delURL,
                        'data': '_method=DELETE',
                        'success': function () {
                            dialog.alert('Deleted');
                            if (deleteCallback) {
                                deleteCallback();
                            }
                        }
                    });
                }
            );
        };
    };

    var initDelete = function ($controls, entityURL, deleteCallback) {
        $('span.delete', $controls).click(function () {
            var entityId = $(this).data('entity').id;
            var dh = getDeleteHandler('admin/' + entityURL + '/' + entityId,
                function () {
                    if (deleteCallback) {
                        deleteCallback(entityId);
                    }
                }
            );
            dh();
        });
    };

    return {'init': function ($formModal, $controls, entityURL, deleteCallback) {
            var $form = $('form', $formModal);

            /**
             * Edit button click handler
             */
            $('span.edit', $controls).click(function () {
                var cat = $(this).data('entity');
                //populate the form with data
                i18n.populateForm($form, cat);
                //show the edit category form
                $formModal.modal('show');
            });

            initDelete($controls, entityURL, deleteCallback);
        },
        'initDelete' : initDelete,
        'getDeleteHandler' : getDeleteHandler
    };
//close the function & define
});