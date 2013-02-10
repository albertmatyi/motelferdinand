define(
    [
        "helpers/wysihtml5"
    ],
    function(wysihtml5){

        return {
            /**
             * Populate the input fields of a form with data
             */
            'populate' : function ($form, entity) {
                $form.data('entity', entity);
                $('input, select', $form).each(function(idx, el){
                    var $el = $(el);
                    var key = $el.attr('name');
                    $el.val(entity[key] ? entity[key]:'');
                });
                $('textarea', $form).each(function(idx, el){
                    var $el = $(el);
                    var key = $el.attr('name');
                    wysihtml5.setValue($el, entity[key] ? entity[key]:'');
                });
            },
            /**
             *  Submit a form to a url
             */
            'submitForm': function ($form, action, successFunction){
                // update the entity attached to the form 
                // and return it
                var entity = $form.data('entity');
                var arr = $form.serializeArray();
                for (var i = arr.length - 1; i >= 0; i--) {
                    var el = arr[i];
                    if((typeof(entity.id) === 'undefined' && el['name'] != 'id') || entity[el['name']]){
                        entity[el['name']] = el['value'];
                    }
                }
                // POST data to server
                var data = $form.serialize();
                $.ajax({ 
                    url : action,
                    success : function (result){
                        var tmp = $form.data('entity');
                        var isNew = entity == null || isNaN(entity.id);
        
                        entity.id = result.id;
                        if(successFunction){
                            successFunction(entity, isNew);
                        }else{
                            alert(result);
                        }
                    },
                    type : 'POST',
                    data : data,
                    dataType: 'json'
                });
            }
        }
    //close the function & define
    }
);