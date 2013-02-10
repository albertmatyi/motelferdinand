define(
[
    "helpers/i18n",
    "elements/confirmation"
],
function(i18n, confirmation){
    var getDeleteHandler = function (delURL, deleteCallback){
        return function(){
            confirmation.show(function(){
                $.ajax({
                    'type': 'POST',
                    'url': delURL,
                    'data': '_method=DELETE',
                    'success': function(){
                        alert('Deleted');
                        deleteCallback && deleteCallback();
                    }
                });
            });
        };
    };

    var initDelete = function($controls, entityURL, deleteCallback){
        $('span.delete', $controls).click(function(){
            var entityId = $(this).data('entity').id;
            getDeleteHandler('admin/'+entityURL+'/'+entityId, function(){
                deleteCallback && deleteCallback(entityId);
            })(); 
        });
    };
    
    return {'init': function($formModal, $controls, entityURL, deleteCallback){
            var $form = $('form', $formModal);

            /**
             * Edit button click handler
             */
            $('span.edit', $controls).click(function (){
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