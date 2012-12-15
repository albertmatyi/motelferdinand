define(
    [
        "helpers/i18n",
        "elements/admin/controls"
    ],
    function(i18n, adminControls){
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