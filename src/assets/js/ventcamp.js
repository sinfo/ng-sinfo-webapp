var Ventcamp;

; (function ($) {

    $(document).on('ready', function () {
        Ventcamp.init();
    });

})(jQuery);


// Main theme functions start
Ventcamp = {

    log: function (msg) {
        if (this.options.log) console.log('%cStartupLy Log: ' + msg, 'color: #1ac6ff');
    },

    //sticky menu initialization
    stickMenu: function () {
        var $header = $('header');

        $header.css('min-height', $header.height());
        $header.addClass('fixed');
        $('.fade-in-on-stick').fadeIn();
    },

    unstickMenu: function () {
        var $header = $('header');

        $header.removeClass('fixed');
        $header.css('min-height', '');
        $('.fade-in-on-stick').fadeOut();
    },

    checkHeaderStatus: function () {
        if ($('header').length) {
            var $header = $('header'),
                scrollTop = $(window).scrollTop(),
                headerTop = $header.offset().top;

            if (scrollTop >= headerTop) {
                this.stickMenu();

            } else {
                this.unstickMenu();
            }
        }
    },

    //onload handler
    windowLoadHeandler: function (event) {
        this.log('Window load handler');

        this.checkHeaderStatus();
    },

    //on scroll handler
    windowScrollHandler: function (event) {
        this.checkHeaderStatus();
    },

    //small back-to-top link function
    backToTopHandler: function () {
        $('html, body').animate({
            scrollTop: 0,
            easing: 'swing'
        }, 750);
    },


    setEventHandlers: function () {
        var _this = this;

        $(window).on('load', function (event) {
            _this.windowLoadHeandler(event);
        });

        $('.back-to-top').on('click', function (event) {
            event.preventDefault();
            _this.backToTopHandler();
        });

        $('.navbar-collapse').on('mousewheel DOMMouseScroll', function (event) {
            if (_this.mobileDevice) {
                var e0 = event.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;

                this.scrollTop -= delta;
                event.preventDefault();
            }
        });

        this.log('Set event hendlers');
    },

    videoPosition: function () {
        var original_video_w = 1280;
        var original_video_h = 720;
        var original_video_r = original_video_w / original_video_h;

        var video_wrapper_w = $('.video-bg').width();
        var video_wrapper_h = $('.video-bg').height();
        var video_wrapper_r = video_wrapper_w / video_wrapper_h;

        var css = {
            'position': 'absolute'
        };

        if (original_video_w > video_wrapper_w) {
            var w_translation = (original_video_w - video_wrapper_w) / 2;
            css['left'] = -w_translation;
        }

        if (original_video_h > video_wrapper_h) {
            var h_translation = (original_video_h - video_wrapper_h) * 0.6;
            css['top'] = -h_translation;
        }

        $('.video-bg video').css(css);
    },

    init: function (options) {
        this.options = $.extend(this.defaults, options, $('body').data());

        this.log('Init');

        this.setEventHandlers();

        this.videoPosition();
    }
}

$('.navigation-item').on('click', function (event) {
    if ($('#navigation').hasClass('in')) {
        $('#navigation').removeClass('in');
    }
});

