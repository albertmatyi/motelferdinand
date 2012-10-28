(function($){
	$.fn.picaslide = function(slideOpts, successCallback){
		var scope = $(this);
		var user = scope.attr('data-picaslide-username');
		var album = scope.attr('data-picaslide-albumid');
		var w=scope.width();
		var width = w+'px';
		var height = w*3/4+'px';
		scope.css('width', width);
        scope.css('height', height);
	    $.picasa.images(user, album, function(images) {
	        var picasaAlbum = "<div class='picasa-album picaslides-container' style=\"height: "+height+"; width: "+width+";\">\n";
	        $.each(images, function(i, element) {
	          picasaAlbum += "  <div class='picasa-image' style=\"width: "+width+"; height: "+height+";"+
	          " background-image: url("+element.url.replace(/(\/)([^\/]+)$/, '$1s'+Math.max(parseInt(height), parseInt(width))+'/$2')+"); background-size: cover; background-position: center;\""+
	          ">\n";
//	          picasaAlbum += "    <a class='picasa-image-large' href='" + element.url + "'>\n";
//	          picasaAlbum += "      <img class='picasa-image-thumb' src='" + element.thumbs[3].url + "'/>\n";
//	          picasaAlbum += "    </a>\n";
	          picasaAlbum += "  </div>\n";
	        });
	        picasaAlbum += "</div>";
	        scope.html(picasaAlbum);
	        slideOpts['container'] = 'picaslides-container';
	        slideOpts['paginationClass'] = 'picaslide-pagination';
	        scope.slides(slideOpts);
	        if (successCallback) {
		        successCallback.apply(scope, images);
	        }
	        scope.show();
	    });	
   }
})(jQuery);