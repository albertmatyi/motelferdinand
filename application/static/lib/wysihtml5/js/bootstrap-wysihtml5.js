define([
        "/static/lib/wysihtml5/js/advanced_parser_rules.js",
        "/static/lib/wysihtml5/js/wysihtml5-0.3.0.min.js"
        ], function(){
    !function($, wysi) {
      "use strict";

      var templates = {
          "font-styles": "<li class='dropdown'>" +
                             "<a class='btn dropdown-toggle' data-toggle='dropdown' href='#'>" +
                                 "<i class='icon-font'></i>&nbsp;<b class='caret'></b>" +
                             "</a>" +
                             "<ul class='dropdown-menu'>" +
                                 "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div'>Normal</a></li>" +
                                 "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1'>Heading 1</a></li>" +
                                 "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2'>Heading 2</a></li>" +
                             "</ul>" +
                         "</li>",
          "emphasis": "<li>" +
                             "<div class='btn-group'>" +
                                 "<a class='btn' data-wysihtml5-command='bold' title='CTRL+B'><b>B</b></a>" +
                                 "<a class='btn' data-wysihtml5-command='italic' title='CTRL+I'><i>I</i></a>" +
                                 "<a class='btn' data-wysihtml5-command='underline' title='CTRL+U'><u>U</u></a>" +
                             "</div>" +
                         "</li>",
          "lists": "<li>" +
                             "<div class='btn-group'>" +
                                 "<a class='btn' data-wysihtml5-command='insertUnorderedList' title='Unordered List'><i class='icon-list'></i></a>" +
                                 "<a class='btn' data-wysihtml5-command='insertOrderedList' title='Ordered List'><i class='icon-th-list'></i></a>" +
                                 "<a class='btn' data-wysihtml5-command='Outdent' title='Outdent'><i class='icon-indent-right'></i></a>" +
                                 "<a class='btn' data-wysihtml5-command='Indent' title='Indent'><i class='icon-indent-left'></i></a>" +
                             "</div>" +
                         "</li>",
         "link": "<li>" +
                         "<div class='bootstrap-wysihtml5-insert-link-modal modal hide fade'>" +
                             "<div class='modal-header'>" +
                                 "<a class='close' data-dismiss='modal'>&times;</a>" +
                                 "<h3>Insert Link</h3>" +
                             "</div>" +
                             "<div class='modal-body'>" +
                                 "<input value='http://' class='bootstrap-wysihtml5-insert-link-url input-xlarge'>" +
                             "</div>" +
                             "<div class='modal-footer'>" +
                                 "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>" +
                                 "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert link</a>" +
                             "</div>" +
                         "</div>" +
                         "<a class='btn' data-wysihtml5-command='createLink' title='Link'><i class='icon-share'></i></a>" +
                     "</li>",
          "image": "<li>" +
                             "<div class='bootstrap-wysihtml5-insert-image-modal modal hide fade'>" +
                                 "<div class='modal-header'>" +
                                     "<a class='close' data-dismiss='modal'>&times;</a>" +
                                     "<h3>Insert Image</h3>" +
                                 "</div>" +
                                 "<div class='modal-body'>" +
                                     "<input value='http://' class='bootstrap-wysihtml5-insert-image-url input-xlarge'>" +
                                 "</div>" +
                                 "<div class='modal-footer'>" +
                                     "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>" +
                                     "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert image</a>" +
                                 "</div>" +
                             "</div>" +
                             "<a class='btn' data-wysihtml5-command='insertImage' title='Insert image'><i class='icon-picture'></i></a>" +
                         "</li>",
          "insertHTML": "<li>" +
                         "<div class='bootstrap-wysihtml5-insert-html-modal modal hide fade'>" +
                             "<div class='modal-header'>" +
                                 "<a class='close' data-dismiss='modal'>&times;</a>" +
                                 "<h3>Embed Html</h3>" +
                             "</div>" +
                             "<div class='modal-body'>" +
                                 "<textarea class='bootstrap-wysihtml5-insert-html-content' cols='30' rows='5'></textarea>" +
                             "</div>" +
                             "<div class='modal-footer'>" +
                                 "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>" +
                                 "<a href='#' class='btn btn-primary' data-dismiss='modal'>Embed</a>" +
                             "</div>" +
                         "</div>" +
                         "<a class='btn' data-wysihtml5-command='insertHTML' title='Embed HTML'><i class='icon-chevron-left'></i><i class='icon-chevron-right'></i></a>" +
                     "</li>",
          "insertGallery": "<li>" +
                     "<div class='bootstrap-wysihtml5-insert-gallery-modal modal hide fade'>" +
                         "<div class='modal-header'>" +
                             "<a class='close' data-dismiss='modal'>&times;</a>" +
                             "<h3>Insert Picasa album</h3>" +
                         "</div>" +
                         "<div class='modal-body'>" +
                             "<input class='bootstrap-wysihtml5-insert-gallery-url input-xlarge' placeholder='Picasa Gallery URL'/>" +
                         "</div>" +
                         "<div class='modal-footer'>" +
                             "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>" +
                             "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert</a>" +
                         "</div>" +
                     "</div>" +
                     "<a class='btn picaslide' data-wysihtml5-command='insertHTML' title='Insert gallery'><img src='/static/img/picasa_s.png' alt='Insert picasa album'/></a>" +
                 "</li>",        
          "html":
                         "<li>" +
                             "<div class='btn-group'>" +
                                 "<a class='btn' data-wysihtml5-action='change_view' title='Edit HTML'><i class='icon-pencil'></i></a>" +
                             "</div>" +
                         "</li>"
      };

      var defaultOptions = {
          "font-styles": true,
          "emphasis": true,
          "lists": true,
          "link": true,
          "image": true,
          "insertHTML": true,
          "insertGallery": true,
          "html": true,
          events: {},
          parserRules: {
              tags: {
                  "b": {},
                  "span": {},
                  "i": {},
                  "br": {},
                  "ol": {},
                  "ul": {},
                  "li": {},
                  "h1": {},
                  "h2": {},
                  "blockquote": {},
                  "u": 1,
                  "img": {
                      "check_attributes": {
                          "width": "numbers",
                          "alt": "alt",
                          "src": "url",
                          "height": "numbers"
                      }
                  },
                  "a": {
                      set_attributes: {
                          target: "_blank",
                          rel: "nofollow"
                      },
                      check_attributes: {
                          href: "url" // important to avoid XSS
                      }
                  }
              }
          },
          stylesheets: []
      };

      var Wysihtml5 = function(el, options) {
          this.el = el;
          this.toolbar = this.createToolbar(el, options || defaultOptions);
          this.editor = this.createEditor(options);

          window.editor = this.editor;

          $('iframe.wysihtml5-sandbox').each(function(i, el){
              $(el.contentWindow).off('focus.wysihtml5').on({
                'focus.wysihtml5' : function(){
                   $('li.dropdown').removeClass('open');
                 }
              });
          });
      };

      Wysihtml5.prototype = {

          constructor: Wysihtml5,

          createEditor: function(options) {
              options = $.extend(defaultOptions, options || {});
  options.toolbar = this.toolbar[0];

  var editor = new wysi.Editor(this.el[0], options);

              if(options && options.events) {
                  for(var eventName in options.events) {
                      editor.on(eventName, options.events[eventName]);
                  }
              }

              return editor;
          },

          createToolbar: function(el, options) {
              var self = this;
              var toolbar = $("<ul/>", {
                  'class' : "wysihtml5-toolbar",
                  'style': "display:none"
              });

              for(var key in defaultOptions) {
                  var value = false;

                  if(options[key] !== undefined) {
                      if(options[key] === true) {
                          value = true;
                      }
                  } else {
                      value = defaultOptions[key];
                  }

                  if(value === true) {
                      toolbar.append(templates[key]);

                      if(key === "html") {
                          this.initHtml(toolbar);
                      }

                      if(key === "link") {
                          this.initInsertLink(toolbar);
                      }

                      if(key === "image") {
                          this.initInsertImage(toolbar);
                      }
                      
                      if(key === "insertHTML") {
                          this.initInsertHtml(toolbar);
                      }
                      if(key === "insertGallery") {
                          this.initInsertGallery(toolbar);
                      }
                  }
              }

              if(options.toolbar) {
                  for(key in options.toolbar) {
                     toolbar.append(options.toolbar[key]);
                  }
              }

              toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
                  var el = $(e.srcElement);
                  self.toolbar.find('.current-font').text(el.html());
              });

              this.el.before(toolbar);

              return toolbar;
          },

          initHtml: function(toolbar) {
              var changeViewSelector = "a[data-wysihtml5-action='change_view']";
              toolbar.find(changeViewSelector).click(function(e) {
                  toolbar.find('a.btn').not(changeViewSelector).toggleClass('disabled');
              });
          },
          
          initInsertGallery: function(toolbar) {
              var self = this;
              var insertGalleryModal = toolbar.find('.bootstrap-wysihtml5-insert-gallery-modal');
              var urlInput = insertGalleryModal.find('.bootstrap-wysihtml5-insert-gallery-url');
              var insertButton = insertGalleryModal.find('a.btn-primary');
              var initialValue = '';
              
              var insertGallery = function() {
                  var url = urlInput.val();
                  var username = /.com(\/photos)?\/(\d+)/.exec(url)[2];
                  var albumID = /.com(\/photos)?\/\d+(\/albums)?\/([^\/#]+)/.exec(url)[3];
                  urlInput.val(initialValue);
                  var content='&nbsp;<div class="picaslide"'+
          		' data-picaslide-username="'+username+'"'+
          		' data-picaslide-albumid="'+albumID+'"'+
          		'>[<img src="/static/img/picasa_s.png" alt="Insert picasa album"/> gallery comes here]</div>&nbsp;';
                  self.editor.composer.commands.exec("insertHTML", content);
              };

              insertButton.click(insertGallery);

              insertGalleryModal.on('shown', function() {
                  urlInput.focus();
              });

              insertGalleryModal.on('hide', function() {
                  self.editor.currentView.element.focus();
              });

              toolbar.find('a[data-wysihtml5-command=insertHTML].picaslide').click(function() {
                  insertGalleryModal.modal('show');
                  insertGalleryModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
  e.stopPropagation();
  });
                  return false;
              });
          },
          
          initInsertHtml: function(toolbar) {
              var self = this;
              var insertHtmlModal = toolbar.find('.bootstrap-wysihtml5-insert-html-modal');
              var textarea = insertHtmlModal.find('.bootstrap-wysihtml5-insert-html-content');
              var insertButton = insertHtmlModal.find('a.btn-primary');
              var initialValue = textarea.val();

              var insertHtml = function() {
                  var content = textarea.val();
                  textarea.val(initialValue);
                  self.editor.composer.commands.exec("insertHTML", content);
              };

              insertButton.click(insertHtml);

              insertHtmlModal.on('shown', function() {
                  textarea.focus();
              });

              insertHtmlModal.on('hide', function() {
                  self.editor.currentView.element.focus();
              });

              toolbar.find('a[data-wysihtml5-command=insertHTML]').click(function() {
                  insertHtmlModal.modal('show');
                  insertHtmlModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
  e.stopPropagation();
  });
                  return false;
              });
          },

          initInsertImage: function(toolbar) {
              var self = this;
              var insertImageModal = toolbar.find('.bootstrap-wysihtml5-insert-image-modal');
              var urlInput = insertImageModal.find('.bootstrap-wysihtml5-insert-image-url');
              var insertButton = insertImageModal.find('a.btn-primary');
              var initialValue = urlInput.val();

              var insertImage = function() {
                  var url = urlInput.val();
                  urlInput.val(initialValue);
                  self.editor.composer.commands.exec("insertImage", url);
              };

              urlInput.keypress(function(e) {
                  if(e.which == 13) {
                      insertImage();
                      insertImageModal.modal('hide');
                  }
              });

              insertButton.click(insertImage);

              insertImageModal.on('shown', function() {
                  urlInput.focus();
              });

              insertImageModal.on('hide', function() {
                  self.editor.currentView.element.focus();
              });

              toolbar.find('a[data-wysihtml5-command=insertImage]').click(function() {
                  insertImageModal.modal('show');
                  insertImageModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
  e.stopPropagation();
  });
                  return false;
              });
          },

          initInsertLink: function(toolbar) {
              var self = this;
              var insertLinkModal = toolbar.find('.bootstrap-wysihtml5-insert-link-modal');
              var urlInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-url');
              var insertButton = insertLinkModal.find('a.btn-primary');
              var initialValue = urlInput.val();

              var insertLink = function() {
                  var url = urlInput.val();
                  urlInput.val(initialValue);
                  self.editor.composer.commands.exec("createLink", {
                      href: url,
                      target: "_blank",
                      rel: "nofollow"
                  });
              };
              var pressedEnter = false;

              urlInput.keypress(function(e) {
                  if(e.which == 13) {
                      insertLink();
                      insertLinkModal.modal('hide');
                  }
              });

              insertButton.click(insertLink);

              insertLinkModal.on('shown', function() {
                  urlInput.focus();
              });

              insertLinkModal.on('hide', function() {
                  self.editor.currentView.element.focus();
              });

              toolbar.find('a[data-wysihtml5-command=createLink]').click(function() {
                  insertLinkModal.modal('show');
                  insertLinkModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
                    e.stopPropagation();
                    });
                  return false;
              });


          }
      };

      $.fn.wysihtml5 = function (options) {
          return this.each(function () {
              var $this = $(this);
              $this.data('wysihtml5', new Wysihtml5($this, options));
          });
      };

      $.fn.wysihtml5.Constructor = Wysihtml5;
  }(window.jQuery, window.wysihtml5);
});