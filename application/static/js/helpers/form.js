define(
    [
        "/static/lib/jquery-1.7.2.min.js",
    ],
    function(js){

        return {
            /**
             * Populate the input fields of a form with data
             */
            'populate' : function ($form, data) {
                $('input, select', $form).each(function(idx, el){
                    $el = $(el);
                    var key = $el.attr('name');
                    if(data[key]){
                        $el.val(data[key]);
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
                var data = $form.serialize();
                $.ajax({ 
                    url : action,
                    success : successFunction,
                    type : 'POST',
                    data : data,
                    dataType: 'json'
                });
            }
        }
    //close the function & define
    }
);