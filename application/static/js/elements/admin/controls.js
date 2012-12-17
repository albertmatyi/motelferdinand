define(
[
    "helpers/i18n",
    "elements/confirmation"

],
function(i18n, confirmation){
    
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

            $('span.delete', $controls).click(function (){
                var entityId = $(this).data('entity').id;
                confirmation.show(function(){
                    $.ajax({
                        'type': 'POST',
                        'url': 'admin/'+entityURL+'/'+entityId,
                        'data': '_method=DELETE',
                        'success': function(){
                            alert('Deleted');
                            deleteCallback && deleteCallback(entityId);
                        }
                    });
                });
            });

        }
    };
//close the function & define
});