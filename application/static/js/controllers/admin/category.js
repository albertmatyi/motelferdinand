/*global define */
/*global $ */
/*global model */
/*global _ */

define(
[
    'helpers/i18n',
    'elements/admin/controls',
    'helpers/transparency',
    'controllers/admin/content',
    'controllers/admin/bookable',
    'view/category',
    'view/bookable',
    'view/directives/menu',
    'view/directives/body'
],
function (i18n, adminControls, transparency, adminContent, adminBookable, categoryView, bookableView, navDirective, bodyDirective) {
    "use strict";
    var TAB_ID_BASE = 'editCategory-';

    var $formModal = $('#categoryEditFormModal');

    i18n.renderLanguageTabs($formModal, TAB_ID_BASE);

    var $addCategoryButton = null;

    $('#submitCategoryEditForm').click(function () {
        var $form = $('form', $formModal);
        i18n.submitForm($form, '/admin/categories/', function (entity, isNew) {
            if (!isNew) {
                var $cat = $('#Category' + entity.id);
                var ttl = entity.i18n[model.language].title;
                $('.nav a[href="#Category' + entity.id + '"]').text(ttl);
                $('.category-title', $cat).text(ttl);
                $('.category-description', $cat).html(entity.i18n[model.language].description);
            } else {
                entity.contents = [];
                entity.bookables = [];
                add(entity);
                $addCategoryButton.detach().appendTo(categoryView.menu);
                model.categories.push(entity);
                model.db.category[entity.id] = entity;
            }
        });
    });

    var add = function (entity) {
        var $el = transparency.render(categoryView.menuTemplate, entity, navDirective);
        categoryView.menu.append($el);
        $el = transparency.render(categoryView.categoryTemplate, entity, bodyDirective);

        categoryView.container.append($el);

        bookableView.render($el);
        adminContent.initAddButton($el);
        adminBookable.initAddButton($el);

        var $controls = $('.page-header .admin-controls ', $el);
        adminControls.init($formModal, $controls, 'categories', deletedCallback);
    };

    var deletedCallback = function (deletedId) {
        //remove the HTML
        $('#Category' + deletedId).remove();
        $('.nav a[href="#Category' + deletedId + '"]').remove();
        var cat = model.db.category[deletedId];
        delete model.db.category[deletedId];
        var idx = _.indexOf(model.categories, cat);
        if (idx > -1) {
            model.categories.splice(idx, 1);
        }
    };

    return {'init': function () {
            var $controls = $('.page-header .admin-controls ');
            adminControls.init($formModal, $controls, 'categories', deletedCallback);

            // add "add category button"
            categoryView.menu.append('<li>' +
                '<a href="#" title="' + i18n.translate('Add category') + '" class="add">' +
                    '<i class="icon-plus icon-white"></i>' +
                '</a>' +
            '</li>');
            $addCategoryButton = $('.navbar .category-nav a.add').parent();

            $addCategoryButton.click(function () {
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