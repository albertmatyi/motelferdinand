/*global define */
/*global $ */
/*global window */

define(
    [
        'config',
        'view/common',
        'view/bookable_variant',
        'lib/jquery'
    ],
    function (config, common, bookableVariantView) {
        'use strict';
        var COLORS = ['turquoise', 'green-sea', 'emerald', 'nephritis', 'peter-river', 'belize-hole', 'amethyst', 'wisteria', 'wet-asphalt', 'midnight-blue', 'sun-flower', 'orange', 'carrot', 'pumpkin', 'alizarin', 'pomegranate', 'clouds', 'silver', 'concrete', 'asbestos'];
        var COL_MAP = [0, 1, 2, 3, 4, 6];

        var getCatPosition = function ($el, forceCalc) {
            if (!$el.data('menu-pos-css') || forceCalc) {
                var position = $el.offset();
                var css = {
                    'top': - $(document).scrollTop() + position.top,
                    'left': position.left,
                    'height': $el.outerHeight(true),
                    'width': $el.outerWidth(true)
                };
                $el.data('menu-pos-css', css);
            }
            return $el.data('menu-pos-css');
        };
        var addColors = function () {
            $('.category').each(function (idx, el) {
                var $el = $(el);
                if (idx === 0) {
                    $el.removeClass('col-md-4').addClass('col-md-8');
                }
//            var color = Math.floor(Math.random() * COLORS.length/2) * 2;
                var color = COLORS[COL_MAP[idx % COL_MAP.length] * 2];
                $el.children('.wrapper').addClass('palette palette-' + color);
            }).on('click', function () {
                    var $this = $(this);
                    var $wrapper = $this.children('.wrapper');
                    if ($this.hasClass('opened')) {
                        $('body').removeClass('category-view');
                        $this.removeClass('ready');
                        $wrapper.css(getCatPosition($wrapper));
                        setTimeout(function () {
                            $this.removeClass('opened').addClass('closed');
                            $wrapper.css({'top': '', 'left': '', 'height': '', 'width': ''});
                        }, 1000);
                    } else {
                        $wrapper.css(getCatPosition($wrapper, true));
                        setTimeout(function () {
//                            $container.addClass('container');
                            $this.addClass('opened').removeClass('closed');
                            setTimeout(function () {
                                $('body').addClass('category-view');
                                $this.addClass('ready');
                                if (config.RENDER_GALLERIES) {
                                    common.renderContentGallery($('.content-description, .category-description', $this));
                                    bookableVariantView.render($this);
                                }
                            }, 1000);
                            $wrapper.css({'top': '', 'left': '', 'height': '', 'width': ''});
                        });
                    }



                });
        };
        return {
            init: function () {
                addColors();

                // DEFAULT SELECTION
                if (window.location.hash.length > 1) {
                    console.log("TODO: open cat");
                }
                $('#loading-overlay').animate({top: -$(window).height()}, 1000, function () {
                    $(this).remove();
                });
            }
        };
    });