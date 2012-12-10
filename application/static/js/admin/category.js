define(
	[
	 	"/static/lib/jquery-1.7.2.min.js"
	],
    function(js, fh){
        var TAB_ID_BASE = 'editCategory-';

        $formModal = $('#categoryEditFormModal');

        $form = $('form', $formModal);

        var formTabNavDirectives = {
            lang_id: {
                text: function(params){
                    return this.name;
                },
                href: function(params){
                    $(params.element).click(function(){
                        $(this).tab('show')
                    });
                    return '#' + TAB_ID_BASE + this.lang_id;
                }
            }
        };
        var formTabDirectives = {
            lang_id: {
                html: function(params){
                    var lang_id = this.lang_id;
                    $('input, textarea', params.element).each(function(idx, el){
                        $el = $(el);
                        $el.attr('name', $el.attr('name')+lang_id)
                        $el.attr('id', $el.attr('id')+lang_id)
                    });
                    return '';
                },
                text: function(params){
                    return '';
                },
                id: function(params){
                    return TAB_ID_BASE + this.lang_id;
                }
            }
        };

        $('.nav-tabs', $formModal).render(model.languages, formTabNavDirectives);
        $('.tab-content', $formModal).render(model.languages, formTabDirectives);

        $('#editCategoryFormTabs a:first', $formModal).tab('show');
    	/**
    	 * Edit button click handler
    	 */
    	$('.admin-controls .edit').click(function (){
            var cat_idx = $(this).attr('data-category-idx');
            //populate the form with data
            for (var i = 0; i < model.languages.length; i++) {
                var lang_id = model.languages[i].lang_id;

                var titleInp=$('#categoryTitleInput'+lang_id, $form);
                titleInp.val(model.categories[cat_idx].i18n[lang_id].title);

                var descInp=$('#categoryDescriptionInput'+lang_id, $form);
                descInp.html(model.categories[cat_idx].i18n[lang_id].description);
            };
    		//show the edit category form
            $formModal.modal('show')
    	});
	//close the function & define
	});