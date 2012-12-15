define(
    [
        "helpers/i18n",
        "elements/admin/controls"
    ],
    function(i18n, adminControls){
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