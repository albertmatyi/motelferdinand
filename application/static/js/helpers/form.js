define(
    [

    ],
    function(){

        return {
            /**
             * Populate the input fields of a form with data
             */
            'populate' : function ($form, entity) {
                $('input, select', $form).each(function(idx, el){
                    $form.data('entity', entity);
                    $el = $(el);
                    var key = $el.attr('name');
                    if(entity[key]){
                        $el.val(entity[key]);
                    }
                });
            },
            /**
             *  Submit a form to a url
             */
            'submitForm': function ($form, action, successFunction){
                if (!successFunction) {
                    successFunction = function (){
                        alert('Saved');
                    };
                }
                // POST data to server
                var data = $form.serialize();
                $.ajax({ 
                    url : action,
                    success : successFunction,
                    type : 'POST',
                    data : data,
                    dataType: 'json'
                });
                // return collected data in form of a dict
                var ret = {};
                var arr = $form.serializeArray();
                for (var i = arr.length - 1; i >= 0; i--) {
                    var el = arr[i];
                    ret[el['name']] = el['value'];
                }
                return ret;
            }
        }
    //close the function & define
    }
);