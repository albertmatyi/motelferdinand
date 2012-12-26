define(
[
    "helpers/i18n",
    "elements/admin/controls",
    "view/category"
],
function(i18n, adminControls, categoryView){
    var TAB_ID_BASE = 'editCategory-';

    var $formModal = $('#categoryEditFormModal');

    i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

    var $addCategoryButton = null;

    $('#submitCategoryEditForm').click(function(){
        var $form = $('form', $formModal);
        i18n.submitForm($form, '/admin/categories/', function(entity, isNew){
            if(!isNew){
                var $cat = $('#Category'+entity.id);
                var ttl = entity.i18n[model.language].title;
                $('.nav a[href="#Category'+entity.id+'"]').text(ttl)
                $('.category-title', $cat).text(ttl);
                $('.category-description', $cat).html(entity.i18n[model.language].description);
            } else {
                entity.contents = [];
                entity.bookables = [];
                categoryView.add(entity);
                $addCategoryButton.detach().appendTo(categoryView.menu);
                model.categories.push(entity);
                model.db.category[entity.id]=entity;
            }
        });
    });

    var deletedCallback = function (deletedId){
        //remove the HTML
        $('#Category'+deletedId).remove();
        $('.nav a[href="#Category'+deletedId+'"]').remove();
    };

    return {'init': function(){
            var $controls = $('.page-header .admin-controls ');
            adminControls.init($formModal, $controls, 'categories', deletedCallback);

            // add "add category button"
            categoryView.menu.append('<li>'+
                '<a href="#" title="'+i18n.translate('Add category')+'" class="add">'+
                    '<i class="icon-plus icon-white"></i>'+
                '</a>'+
            '</li>');
            $addCategoryButton = $('.navbar .category-nav a.add').parent();

            $addCategoryButton.click(function(){
                //populate the form with data
                i18n.populateForm($('form', $formModal), {});
                //show the edit category form
                $formModal.modal('show');
                // TODO set focus on 1st input
            });
        }
    };
//close the function & define
});