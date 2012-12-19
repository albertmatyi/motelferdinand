define(
[
    "helpers/i18n",
    "elements/admin/controls",
    "directives/menu",
    "directives/body_content"
            
],
function(i18n, adminControls, tdm, tdc){
    var TAB_ID_BASE = 'editCategory-';

    var $formModal = $('#categoryEditFormModal');

    i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

    $('#submitCategoryEditForm').click(function(){
        var $form = $('form', $formModal);
        var isNew = $form.data('entity').id > 0;
        i18n.submitForm($form, '/admin/categories/', function(entity){
            if(isNew){
                var $cat = $('#Category'+entity.id);
                var ttl = entity.i18n[model.language].title;
                $('.nav a[href="#Category'+entity.id+'"]').text(ttl)
                $('.category-title', $cat).text(ttl);
                $('.category-description', $cat).html(entity.i18n[model.language].description);
            } else {
                $('.category-nav').render(entity, tdm.menuDirective);
                $('.categories').render(entity, tdc.contentDirective) &&
                $('.content.span4').css('margin-left',parseInt($('.content.span4').css('margin-left'))*.5+'px');
            }
            console.log(entity);
        });
    });

    var deletedCallback = function (deletedId){
        //remove the HTML
        $('#Category'+deletedId).remove();
        $('.nav a[href="#Category'+deletedId+'"]').remove();
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