define(
[
    'lib/transparency'
],
function(transparency){
    $('body').append('<div id="transparencyRenderArea" style="display:none;"></div>')
    var $renderArea = $('#transparencyRenderArea');

    return {
        /**
         * It renders a string and returns the reference
         * to the rendered dom elements.
         * @param thing- the object/string to be rendered
         * @param data - passed to transparency.render
         * @param directive - passed to transparency.render
         * @returns The reference to the rendered element(s). That were detached from the html after 
         * rendering
         */
        'render': function(thing, data, directive){
            
            return $('>*', $renderArea.clone().html('').append(thing).render(data, directive));
            // return  $renderArea);
        }
    }
//close the function & define
}
);