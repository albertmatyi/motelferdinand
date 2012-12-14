define(
    [
        "/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
        "admin/controls"
    ],
    function(js, i18n, formHelper, adminControls){
        var TAB_ID_BASE = 'editBookable-';

        var $formModal = $('#bookableEditFormModal');

        var $form = $('form', $formModal);

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitBookableEditForm').click(function(){
            formHelper.submitForm($form, '/admin/bookables/');
        });

        return {'init': function(){
                var $controls = $('.bookable .admin-controls ');
                adminControls.init($formModal, $form, $controls);
            }
        };
    //close the function & define
    });