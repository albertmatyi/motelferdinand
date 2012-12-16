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

            var $addBookableButton = $('.page-header .admin-controls .addBookableButton');

            $addBookableButton.click(function(){
                //populate the form with data
                i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
                //show the edit category form
                $formModal.modal('show');

            });
        }
    };
//close the function & define
});