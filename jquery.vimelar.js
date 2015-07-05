/**
 * jQuery Vimelar plugin
 * @author: Sozonov Alexey
 * @version: v.1.0
 * licensed under the MIT License
 * updated: July 5, 2015
 * since 2015
 * Enjoy.
 */

;(function ($, window) {

    // defaults
    var defaults = {
        ratio: 16/9, // usually either 4/3 or 16/9 -- tweak as needed
        videoId: '8970192',
        width: $(window).width(),
        wrapperZIndex: 99
    };

    // methods
    var vimelar = function(node, options) { // should be called on the wrapper div
        var options = $.extend({}, defaults, options),
        $node = $(node); // cache wrapper node

        // set up css prereq's, inject vimelar container and set up wrapper defaults
        $('html,body').css({'width': '100%', 'height': '100%'});

        // build container
        $('<iframe />', {
            name: 'myFrame',
            id: 'vimelar-player',
            src: '//player.vimeo.com/video/' + options.videoId + (typeof options.parameters !== "undefined" ? '?' + $.param(options.parameters) : ''),
            style: 'position: absolute; width:100%; height: 100%;',
            frameborder: 0,
            webkitallowfullscreen: 1,
            mozallowfullscreen: 1,
            allowfullscreen: 1
        }).prependTo('body').wrap('<div id="vimelar-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"></div>').after('<div id="vimelar-overlay" style="width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;"></div>');

        $node.css({position: 'relative', 'z-index': options.wrapperZIndex});

        // resize handler updates width, height and offset of player after resize/init
        var resize = function() {
            var width = $(window).width(),
                pWidth, // player width, to be defined
                height = $(window).height(),
                pHeight, // player height, tbd
                $vimelarPlayer = $('#vimelar-player');

            // when screen aspect ratio differs from video, video must center and underlay one dimension
            if (width / options.ratio < height) { // if new video height < window height (gap underneath)
                pWidth = Math.ceil(height * options.ratio); // get new player width
                $vimelarPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); // player width is greater, offset left; reset top
            } else { // new video width < window width (gap to right)
                pHeight = Math.ceil(width / options.ratio); // get new player height
                $vimelarPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); // player height is greater, offset top; reset left
            }

        }

        // events
        $(window).load(function() {
            resize();
        })

        $(window).on('resize.vimelar', function() {
            resize();
        })

    }

    // create plugin
    $.fn.vimelar = function (options) {
        return this.each(function () {
            if (!$.data(this, 'vimelar_instantiated')) { // let's only run one
                $.data(this, 'vimelar_instantiated',
                    vimelar(this, options));
            }
        });
    }

})(jQuery, window);