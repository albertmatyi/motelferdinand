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
        if(data.id){
            var $cat = $('#Category'+data.id);
            var ttl = data.i18n[model.language].title;
            $('.nav a[href="#Category"'+data.id+'"]').text(ttl)
            $('.category-title', $cat).text(ttl);
            $('.category-description', $cat).html(data.i18n[model.language].description);
        } else {
            // TODO
        }
        console.log(data);
    });

    var deletedCallback = function (deletedId){
        //remove the HTML
        $('#Category'+deletedId).remove();
    }

    return {'init': function(){
            var $controls = $('.page-header .admin-controls ');
            adminControls.init($formModal, $controls, 'categories', deletedCallback);

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