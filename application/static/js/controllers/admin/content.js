define(
    [
        "/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
        "elements/admin/controls"
    ],
    function(js, i18n, formHelper, adminControls){
        var TAB_ID_BASE = 'editContent-';

        var $formModal = $('#contentEditFormModal');

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitContentEditForm').click(function(){
            var $form = $('form', $formModal);
            var data = i18n.submitForm($form, '/admin/contents/');
            console.log(data);
        });

        return {'init': function(){
                var $controls = $('.content .admin-controls ');
                adminControls.init($formModal, $controls);
            }
        };
    //close the function & define
    });