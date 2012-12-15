define(
    [
        "/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
        "elements/admin/controls"
    ],
    function(js, i18n, formHelper, adminControls){
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