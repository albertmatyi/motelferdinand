define(
[
    "helpers/i18n",
    "elements/admin/controls"
],
function(i18n, adminControls){
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

            // add "add category button"
            $('.navbar .category-nav').append('<li>'+
                '<a href="#" title="'+i18n.translate('Add category')+'" class="add">'+
                    '<i class="icon-plus icon-white"></i>'+
                '</a>'+
            '</li>');
            var $addCategoryButton = $('.navbar .category-nav a.add');

            $addCategoryButton.click(function(){
                //populate the form with data
                i18n.populateForm($('form', $formModal), {});
                //show the edit category form
                $formModal.modal('show');
            });
        }
    };
//close the function & define
});