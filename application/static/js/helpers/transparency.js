define(
[
    "/static/lib/transparency.min.js"
],
function(transparency){
    $('body').append('<div id="transparencyRenderArea" style="display:none;"></div>')
    var $renderArea = $('#transparencyRenderArea');

    return {
        /**
         * It renders a string and returns the reference
         * to the rendered dom elements.
         * @param strToRender- the string to be rendered
         * @param data - passed to transparency.render
         * @param directive - passed to transparency.render
         * @returns The reference to the rendered element(s). That were detached from the html after 
         * rendering
         */
        'render': function(strToRender, data, directive){
            
            return $('>*', $renderArea.clone().html(strToRender).render(data, directive));
            // return  $renderArea);
        }
    }
//close the function & define
}
);