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
        i18n.submitForm($form, '/admin/bookables/', function(entity, isNew){
            // update UI
            if(!isNew){
                var $cont = $('#Bookable'+data.id);
                $('.bookable-title', $cont).text(data.i18n[model.language].title);
                $('.bookable-description', $cont).html(data.i18n[model.language].description);
            }
        });
    });

    var deletedCallback = function (deletedId){
        //remove the HTML
        $('#Bookable'+deletedId).remove();
    }

    var initAddButton = function($context){
        if(typeof($context) === "undefined"){
            $context = $('body');
        }
        var $addBookableButton = $('.page-header .admin-controls .addBookableButton', $context);

        $addBookableButton.click(function(){
            //populate the form with data
            i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
            //show the edit bookable form
            $formModal.modal('show');

        });
    };

    return {'init': function(){
            var $controls = $('.bookable .admin-controls ');
            adminControls.init($formModal, $controls, 'bookables', deletedCallback);

            initAddButton();
        },
        'initAddButton':initAddButton
    };
//close the function & define
});