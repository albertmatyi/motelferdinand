define(
[
    'helpers/i18n',
    'elements/admin/controls',
    'view/directives/bookable',
    'helpers/transparency',
    'helpers/progress',
    'view/common',
    'view/bookable',
    'controllers/booking',
],
function(i18n, adminControls, directive, transparency, progress, common, view, booking){
    var $bookableWrapper = $('.bookables-wrapper').clone();
    
    var TAB_ID_BASE = 'editBookable-';

    var $formModal = $('#bookableEditFormModal');

    i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

    $('#submitBookableEditForm').click(function(){
        var $form = $('form', $formModal);
        i18n.submitForm($form, '/admin/bookables/', function(entity, isNew){
            // update UI
            if(!isNew) {
                var $cont = $('#Bookable'+entity.id);
                $('.bookable-title', $cont).text(entity.i18n[model.language].title);
                $('.bookable-description', $cont).html(entity.i18n[model.language].description);
                $('*[data-bind=price]', $cont).text(entity.price);
                $('*[data-bind=beds]', $cont).text(entity.beds);
                booking.reset();
            } else {
                add(entity);
            }
        });
    });

    var add = function(entity){
        model.db.content[entity.id] = entity;
        var cat = model.db.category[entity.category];
        cat.bookables.push(entity);
        rerenderBookables(cat);
    }

    var deletedCallback = function (deletedId){
        //rerender the bookables
        var bkbl = model.db.bookable[deletedId];
        var cat = model.db.category[bkbl.category];
        cat.bookables.splice(cat.bookables.indexOf(bkbl),1);
        rerenderBookables(cat);
        delete model.db.bookable[deletedId];
    }

    var rerenderBookables = function(category){
        var $newBW = $bookableWrapper.clone();
        $('#Category'+category.id+ ' .bookables-wrapper').remove();
        $('#Category'+category.id+ ' .category-content').prepend($newBW);
        $('.bookables', $newBW).render(category.bookables, directive);
        initAdminControls($newBW);
        view.render($('#Category'+category.id));
        booking.setup([category]);
        // var $bookables = transparency.render(containerTemplate, category.bookables, directive);
        // $('#Category'+category.id+ ' .bookables').html('').append($bookables);
        // initAdminControls($bookables);
        // common.renderContentGallery('.content-description div.picaslide', $bookables);
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

    var initAdminControls = function($ctxt){
        if(!$ctxt){
            $ctxt = $('body');
        }
        var $controls = $('.bookable .admin-controls ', $ctxt);
        adminControls.init($formModal, $controls, 'bookables', deletedCallback);
    }

    return {'init': function(){
            initAdminControls();

            initAddButton();

        },
        'initAddButton':initAddButton
    };
//close the function & define
});