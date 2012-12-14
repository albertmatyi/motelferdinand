define(
    [
        "/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
        "admin/controls"
    ],
    function(js, i18n, formHelper, adminControls){
        var TAB_ID_BASE = 'editContent-';

        var $formModal = $('#contentEditFormModal');

        var $form = $('form', $formModal);

        var $controls = $('.content .admin-controls ');

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitContentEditForm').click(function(){
            formHelper.submitForm($form, '/admin/contents/');
        });

        return {'init': function(){
                adminControls.init($formModal, $form, $controls);
            }
        };
    //close the function & define
    });