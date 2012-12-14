define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "i18n",
        'helpers/form'
	],
    function(js, i18n, formHelper){
        var TAB_ID_BASE = 'editCategory-';

        var $formModal = $('#categoryEditFormModal');

        var $form = $('form', $formModal);

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitCategoryEditForm').click(function(){
            formHelper.submitForm($form, '/admin/categories/');
        });

        return {'init': function(){
                /**
            	 * Edit button click handler
            	 */
            	$('.page-header .admin-controls .edit').click(function (){
                    var cat_idx = $(this).attr('data-category-idx');
                    var cat = model.categories[cat_idx];

                    formHelper.populate($form, cat);
                    //populate the form with data
                    i18n.populateFields(cat, $form);
            		//show the edit category form
                    $formModal.modal('show')
            	});
            }
        };
	//close the function & define
	});