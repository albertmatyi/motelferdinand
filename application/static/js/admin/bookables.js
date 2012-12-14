define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "i18n"
	],
    function(js, i18n){
        var TAB_ID_BASE = 'editBookable-';

        var $formModal = $('#bookableEditFormModal');

        var $form = $('form', $formModal);

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        return {'init': function(){
                /**
            	 * Edit button click handler
            	 */
            	$('.bookable .admin-controls .edit').click(function (){
                    var bookable_idx = $(this).attr('data-bookable-idx');
                    var cat_idx = 0;
                    //populate the form with data
                    i18n.populateFields(model.categories[cat_idx].bookables[bookable_idx], {
                        'bookableTitleInput' : 'title', 
                        'bookableDescriptionInput' : 'description'
                    }, $formModal);
            		//show the edit bookable form
                    $formModal.modal('show')
            	});
            }
        };
	//close the function & define
	});