define(
    [
        "/static/lib/jquery-1.7.2.min.js",
        "helpers/i18n",
        'helpers/form',
        "elements/admin/controls"
    ],
    function(js, i18n, formHelper, adminControls){
        var TAB_ID_BASE = 'editBookable-';

        var $formModal = $('#bookableEditFormModal');

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        $('#submitBookableEditForm').click(function(){
            var $form = $('form', $formModal);
            var data = i18n.submitForm($form, '/admin/bookables/');
            console.log(data);
        });

        return {'init': function(){
                var $controls = $('.bookable .admin-controls ');
                adminControls.init($formModal, $controls);
            }
        };
    //close the function & define
    });