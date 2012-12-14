define(
	[
	 	"/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
        "admin/controls"
	],
    function(js, i18n, formHelper, adminControls){
        var TAB_ID_BASE = 'editCategory-';

        var $formModal = $('#categoryEditFormModal');

        var $form = $('form', $formModal);

        var $controls = $('.page-header .admin-controls');

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitCategoryEditForm').click(function(){
            formHelper.submitForm($form, '/admin/categories/');
        });

        return {'init': function(){
                adminControls.init($formModal, $form, $controls);
            }
        };
	//close the function & define
	});