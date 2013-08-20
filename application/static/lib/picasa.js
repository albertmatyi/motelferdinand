/*global $ */
/*global define */

define(
  ['lib/jquery'],
  function () {

  var DEFAULT_ERR = function () {
    if (typeof console !== 'undefined' && console.log) {
      console.log('Could not load picasa album');
    }
  };

  $.picasa = {
    albums: function (user, callback, err) {
      err = err || DEFAULT_ERR;
      var url = 'http://picasaweb.google.com/data/feed/base/user/:user_id?alt=json&kind=album&hl=en_US&access=visible&fields=entry(id,media:group(media:content,media:description,media:keywords,media:title))';
      url = url.replace(/:user_id/, user);
      $.support.cors = true;
      url += '&callback=?';
      var success = false;
      $.getJSON(url, function (data) {
        success = true;
        var album = null;
        var albums = [];
        $.each(data.feed.entry, function (i, element) {
          album = {
            id: element.id.$t.split('?')[0].split('albumid/')[1],
            title: element.media$group.media$title.$t,
            description: element.media$group.media$description.$t,
            thumb: element.media$group.media$content[0].url,
          };
          album.images = function (callback) {
            $.picasa.images(user, album.id, callback);
          };
          albums.push(album);
        });
        callback(albums);
      });
      setTimeout(function () {
        if (!success) {
          err();
        }
      }, 2000);
    },

    images: function (user, album, callback, err) {
      var url = 'http://picasaweb.google.com/data/feed/base/user/:user_id/album' + (album.match(/\d{6,}/) !== null ? 'id':'') + '/:album_id?alt=json&kind=photo&hl=en_US&fields=entry(title,gphoto:numphotos,media:group(media:content,media:thumbnail))';
      url = url.replace(/:user_id/, user).replace(/:album_id/, album);
      var image = null;
      var images = [];
      $.support.cors = true;
      url += '&callback=?';
      var success = false;
      $.getJSON(url, function (data) {
        success = true;
        $.each(data.feed.entry, function (i, element) {
          image = element.media$group.media$content[0];
          image.title = element.title.$t;
          image.thumbs = [];
          $.each(element.media$group.media$thumbnail, function (j, jEl) {
            image.thumbs.push(jEl);
          });
          images.push(image);
        });
        callback(images);
      });
      setTimeout(function () {
        if (!success) {
          err();
        }
      }, 2000);
    }
  };

  $.fn.picasaAlbums = function (user, callback) {
    $.picasa.albums(user, function (images) {
      if (callback) {
        callback(images);
      }
    });
  };
});