define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "i18n"
	],
    function(js, i18n){
        var TAB_ID_BASE = 'editContent-';

        var $formModal = $('#contentEditFormModal');

        var $form = $('form', $formModal);

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        return {'init': function(){
                /**
            	 * Edit button click handler
            	 */
            	$('.content .admin-controls .edit').click(function (){
                    var content_idx = $(this).attr('data-content-idx');
                    var cat_idx = $(this).attr('data-category-idx');;
                    //populate the form with data
                    i18n.populateFields(model.categories[cat_idx].contents[content_idx], {
                        'contentTitleInput' : 'title', 
                        'contentDescriptionInput' : 'description'
                    }, $formModal);
            		//show the edit content form
                    $formModal.modal('show')
            	});
            }
        };
	//close the function & define
	});