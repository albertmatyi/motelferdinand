define(
[
    "helpers/i18n",
    "elements/admin/controls",
    'view/content'
],
function(i18n, adminControls, contentView){
    var TAB_ID_BASE = 'editContent-';

    var $formModal = $('#contentEditFormModal');

    i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

    $('#submitContentEditForm').click(function(){
        var $form = $('form', $formModal);
        i18n.submitForm($form, '/admin/contents/', function(entity, isNew){
            // update UI
            if(!isNew) {
                var $cont = $('#Content'+data.id);
                $('.content-title', $cont).text(data.i18n[model.language].title);
                $('.content-description', $cont).html(data.i18n[model.language].description);
            } else {
                contentView.add(entity);
                model.db.content[entity.id] = entity;
                model.db.category[entity.category].contents.push(entity);
            }
        });
    });

    var deletedCallback = function (deletedId){
        //remove the HTML
        $('#Content'+deletedId).remove();
    }

    var initAddButton = function($context){
        if(typeof($context) === "undefined"){
            $context = $('body');
        }
        var $addContentButton = $('.page-header .admin-controls .addContentButton', $context);

        $addContentButton.click(function(){
            //populate the form with data
            i18n.populateForm($('form', $formModal), {category: $(this).data('entity').id});
            //show the edit content form
            $formModal.modal('show');

        });
    };

    return {'init': function(){
            var $controls = $('.content .admin-controls ');
            adminControls.init($formModal, $controls, 'contents', deletedCallback);

            initAddButton();
        },
        'initAddButton':initAddButton
    };
//close the function & define
});