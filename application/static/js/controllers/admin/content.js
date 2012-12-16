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

            var $addContentButton = $('.page-header .admin-controls .addContentButton');

            $addContentButton.click(function(){
                //populate the form with data
                i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
                //show the edit category form
                $formModal.modal('show');

            });
        }
    };
//close the function & define
});