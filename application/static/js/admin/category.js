define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "i18n"
	],
    function(js, i18n){
        var TAB_ID_BASE = 'editCategory-';

        var $formModal = $('#categoryEditFormModal');

        var $form = $('form', $formModal);

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);
        return {'init': function(){
                /**
            	 * Edit button click handler
            	 */
            	$('.page-header .admin-controls .edit').click(function (){
                    var cat_idx = $(this).attr('data-category-idx');
                    //populate the form with data
                    i18n.populateFields(model.categories[cat_idx], {
                        'categoryTitleInput' : 'title', 
                        'categoryDescriptionInput' : 'description'
                    }, $formModal);
            		//show the edit category form
                    $formModal.modal('show')
            	});
            }
        };
	//close the function & define
	});