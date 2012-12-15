define(
    [
        "helpers/i18n",
        "elements/admin/controls"
    ],
    function(i18n, adminControls){
        var TAB_ID_BASE = 'editCategory-';

        var $formModal = $('#categoryEditFormModal');

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitCategoryEditForm').click(function(){
            var $form = $('form', $formModal);
            var data = i18n.submitForm($form, '/admin/categories/');
            console.log(data);
        });

        return {'init': function(){
                var $controls = $('.page-header .admin-controls ');
                adminControls.init($formModal, $controls);
            }
        };
    //close the function & define
    });