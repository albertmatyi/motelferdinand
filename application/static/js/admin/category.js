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
                    $('input', params.element).each(function(idx, el){
                        $el = $(el);
                        $el.attr('name', $el.attr('name')+'-'+lang_id)
                        $el.attr('id', $el.attr('id')+'-'+lang_id)
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
    		//show the edit category form
            $formModal.modal('show')
    	});
	//close the function & define
	});