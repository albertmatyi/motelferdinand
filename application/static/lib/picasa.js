(function($) {
  $.picasa = {
    albums: function(user, callback, err) {
      var url = "http://picasaweb.google.com/data/feed/base/user/:user_id?alt=json&kind=album&hl=en_US&access=visible&fields=entry(id,media:group(media:content,media:description,media:keywords,media:title))"
      url = url.replace(/:user_id/, user);
      $.support.cors = true;
      url += '&callback=?';
      $.getJSON(url, function(data) {
        var album = null;
        var albums = [];
        $.each(data.feed.entry, function(i, element) {
          album = {
            id: element.id["$t"].split("?")[0].split("albumid/")[1],
            title: element["media$group"]["media$title"]["$t"],
            description: element["media$group"]["media$description"]["$t"],
            thumb: element["media$group"]["media$content"][0]["url"],
          }
          album.images = function(callback) {
            $.picasa.images(user, album.id, callback);
          }
          albums.push(album);
        });
        callback(albums);
      }).error(function () {
        console && console.log && console.log("Could not load picasa album");
      });
    },

    images: function(user, album, callback) {
      var url = "http://picasaweb.google.com/data/feed/base/user/:user_id/album"+(album.match(/\d{6,}/) != null ? "id":"")+"/:album_id?alt=json&kind=photo&hl=en_US&fields=entry(title,gphoto:numphotos,media:group(media:content,media:thumbnail))";
      url = url.replace(/:user_id/, user).replace(/:album_id/, album);
      var image = null;
      var images = [];
      $.support.cors = true;
      url += '&callback=?';
      $.getJSON(url, function(data) {
        $.each(data.feed.entry, function(i, element) {
          image = element["media$group"]["media$content"][0];
          image.title = element.title["$t"];
          image.thumbs = [];
          $.each(element["media$group"]["media$thumbnail"], function(j, j_element) {
            image.thumbs.push(j_element);
          });
          images.push(image);
        });
        callback(images);
      });
    }
  };

  $.fn.picasaAlbums = function(user, callback) {
    $.picasa.albums(user, function(images) {
      if (callback) {
        callback(images);
      }
    });
  };

  $.fn.picasaGallery = function(user, album, callback) {
    var scope = $(this);
    $.picasa.images(user, album, function(images) {
      if (callback) {
        callback.apply(scope, images);
      } else {
        var picasaAlbum = "<ul class='picasa-album'>\n";
        $.each(images, function(i, element) {
          picasaAlbum += "  <li class='picasa-image'>\n";
          picasaAlbum += "    <a class='picasa-image-large' href='" + element.url + "'>\n";
          picasaAlbum += "      <img class='picasa-image-thumb' src='" + element.thumbs[1].url + "'/>\n";
          picasaAlbum += "    </a>\n";
          picasaAlbum += "  </li>\n";
        });
        picasaAlbum += "</ul>";
        scope.append(picasaAlbum);
      }
    });
  }
})(jQuery);
