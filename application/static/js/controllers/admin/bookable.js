/*global define */
/*global $ */
/*global model */

define(
    [
        'helpers/i18n',
        'elements/admin/controls',
        'view/directives/bookable',
        'helpers/transparency',
        'view/common',
        'view/bookable',
        'controllers/booking',
        'view/admin/modal'
    ],
    function (i18n, adminControls, directive, transparency, common, view, booking, modal) {
        "use strict";
        var $bookableWrapper = $('.bookables-wrapper').clone();

        var TAB_ID_BASE = 'editBookable-';

        var $formModal = $('#bookableEditFormModal');

        i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

        var deletedCallback = function (deletedId) {
            // rerender the bookables
            var bkbl = model.db.bookable[deletedId];
            var cat = model.db.category[bkbl.category];
            cat.bookables.splice(cat.bookables.indexOf(bkbl), 1);
            rerenderBookables(cat);
            delete model.db.bookable[deletedId];
        };

        var initAdminControls = function ($ctxt) {
            if (!$ctxt) {
                $ctxt = $('body');
            }
            var $controls = $('.bookable .admin-controls ', $ctxt);
            adminControls.init($formModal, $controls, 'bookables', deletedCallback);
        };

        var rerenderBookables = function (category) {
            var $newBW = $bookableWrapper.clone();
            $('#Category' + category.id + ' .bookables-wrapper').remove();
            $('#Category' + category.id + ' .category-content').prepend($newBW);
            $('.bookables', $newBW).render(category.bookables, directive);
            initAdminControls($newBW);
            view.render($('#Category' + category.id));
            booking.setup([category]);
        };

        var add = function (entity) {
            model.db.content[entity.id] = entity;
            var cat = model.db.category[entity.category];
            cat.bookables.push(entity);
            rerenderBookables(cat);
        };


        $('#submitBookableEditForm').click(function () {
            var $form = $('form', $formModal);
            i18n.submitForm($form, '/admin/bookables/', function (entity, isNew) {
                // update UI
                if (!isNew) {
                    var $cont = $('#Bookable' + entity.id);
                    $('.bookable-title', $cont).text(entity.i18n[model.language].title);
                    $('.bookable-description', $cont).html(entity.i18n[model.language].description);
                    $('*[data-bind=price]', $cont).text(entity.price);
                    $('*[data-bind=beds]', $cont).text(entity.beds);
                    $('*[data-bind=beds]', $cont).text(entity.beds);
                    booking.reset();
                } else {
                    add(entity);
                }
                modal.displayAlert($formModal, 'Modified successfully!', 'success');
            });
        });

        var initAddButton = function ($context) {
            if (typeof ($context) === "undefined") {
                $context = $('body');
            }
            var $addBookableButton = $('.page-header .admin-controls .addBookableButton', $context);

            $addBookableButton.click(function (e) {
                e.preventDefault();
                //populate the form with data
                i18n.populateForm($('form', $formModal), {category : $(this).data('entity').id});
                //show the edit bookable form
                $formModal.modal('show');

            });
        };
        return {
            'init' : function () {
                modal.init($formModal);
                initAdminControls();
                initAddButton();
            },
            'initAddButton' : initAddButton
        };
    //close the function & define
    }
);