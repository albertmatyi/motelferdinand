define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
	],
    function(js, i18n, formHelper){
        return {'init': function($formModal, $controls){
                var $form = $('form', $formModal);

                /**
                 * Edit button click handler
                 */
                $('span.edit', $controls).click(function (){
                    var cat = $(this).data('model');
                    //populate the form with data
                    i18n.populateForm($form, cat);
                    //show the edit category form
                    $formModal.modal('show');
                });

            }
        };
	//close the function & define
	});