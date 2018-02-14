var Ventcamp;

;(function($){

    $(document).on('ready', function () {
        Ventcamp.init();

        $('#logo_white').show();
        $('#logo_blue').hide();

        if( !Ventcamp.mobileDevice ) {
            $('.logo img').hover(function (event) {
                $('#logo_white').hide();
                $('#logo_blue').show();
            }, function (event) {
                $('#logo_blue').hide();
                $('#logo_white').show();
            });
        }
    });

})( jQuery );


// Main theme functions start
Ventcamp = {
    defaults: {
        log: true,
        styleSwitcher: false,
        animations: false,
        onePageNav: true,
        alwaysMobileMenuMode: false,
        mobileMenuMaxWidth: 768,
        smoothScroll: false,
        smoothScrollSpeed: 800
    },

    mobileDevice: false,

    log: function (msg) {
        if ( this.options.log ) console.log('%cStartupLy Log: ' + msg, 'color: #1ac6ff');
    },

    // check if site is laoded from mobile device
    checkMobile: function () {
        mobileDeviceOld = this.mobileDevice

        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() < this.options.mobileMenuMaxWidth ) {
            this.mobileDevice = true;

            this.log('Mobile device');
        }else {
            this.mobileDevice = false;

            this.log('Desktop')
        }
    },

    calculateMenuSizes: function () {
        var _this = this,
            $dropdownItem = $('.navigation-item.dropdown'),
            $navbarCollapse = $('.navbar-collapse'),
            winHeight = window.innerHeight;

        if ( $dropdownItem.length ) {
            $dropdownItem.each( function () {
                var $this = $(this),
                    $dropdown = $this.find('.dropdown-menu'),
                    headerHeight = $dropdownItem.closest('header').outerHeight();

                if ( !_this.mobileDevice ) {
                    $dropdown.css( 'max-height', winHeight - headerHeight - 50 );

                }else {
                    $dropdown.css( 'max-height', '' );

                }
            });
        }

        if ( $navbarCollapse.length ) {
            $navbarCollapse.each( function () {
                if ( _this.mobileDevice ) {
                    var headerHeight = $(this).closest('header').outerHeight();

                    $(this).css('max-height', winHeight - headerHeight);
                }
            });
        }

    },

    windowHeightBlock: function () {
        var $blocks = $('.window-height'),
            height = window.innerHeight;

        if ( $blocks.length ) {
            $blocks.each(function () {
                $(this).css('min-height', height);
            });
        }

        this.log( 'Init window height blocks');
    },

    centeredBlock: function() {
        var $blocks = $('.centered-block');

        if ( $blocks.length ) {
            $blocks.each( function () {
                var $el = $(this),
                    $parent = $el.parent(),
                    elHeight = $el.outerHeight(),
                    parentHeight = $parent.outerHeight(),
                    padding = (parentHeight - elHeight) / 2;

                if ( padding >= 0 ) {
                    $parent.css({'padding-top': padding, 'padding-bottom': 0 });
                }
            });
        }

        this.log( 'Init centered blocks');
    },

    // Google map
    initGoogleMap: function() {
        var _this = this;

        if ( $('.map').length ) {
            $('.map').each(function () {
                var mapEl = this;

                var map, marker, geocoder, service;

                var icon = '/assets/img/marker-46x46-blue.png',
                    address,
                    markerLatLng,
                    offsetX,
                    offsetY,
                    relativeOffset,
                    balloons,
                    mapOptions = {
                        zoom: 14,
                        scrollwheel: false,
                        mapTypeControl: false
                    };

                function createMap () {
                    mapOptions.center = markerLatLng

                    map = new google.maps.Map(mapEl, mapOptions);

                    marker = new google.maps.Marker({
                        map: map,
                        icon: icon,
                        position: markerLatLng
                    });

                    map.addListener('projection_changed', function() {
                        centerMap(map, offsetX, offsetY, relativeOffset);
                    });

                    createBalloons();
                }

                function createBalloons () {
                    service = new google.maps.places.PlacesService(map);

                    if ( balloons ) {
                        for (var i = 0; i < balloons.length; i++) {
                            var balloon = balloons[i];

                            if ( typeof balloon == 'string' ) {
                                service.textSearch({
                                    location: markerLatLng,
                                    radius: 5000,
                                    query: balloon
                                }, function(results, status) {
                                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                                        for (var i = 0, place; place = results[i]; i++) {
                                            service.getDetails({placeId: place.place_id}, createMarkers);
                                        };
                                    }
                                });
                            }
                        };
                    }
                }

                function createMarkers(place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var innerContent;

                        innerContent = '<div class="balloon"><strong class="name">' + place.name + '</strong>';

                        if ( place.rating ) {
                            innerContent += '<ul class="list-inline rating">';

                            for (var i = 0; i < Math.floor(place.rating); i++) {
                                innerContent += '<li><span class="fa fa-star"></span></li>'
                            };

                            innerContent += '</ul>';
                        }

                        if ( place.adr_address ) {
                            innerContent += '<p class="address">' + place.adr_address + '</p>';
                        }

                        if ( place.international_phone_number ) {
                            innerContent += '<p class="phone">' + place.international_phone_number + '</p>';
                        }

                        innerContent += '</div>';

                        var infowindow = new google.maps.InfoWindow({
                            position: place.geometry.location,
                            maxWidth: 200,
                            content: innerContent,
                            disableAutoPan: true
                        });

                        infowindow.open(map);
                    }
                }

                function centerMap(map, offsetX, offsetY, relative) {
                    var offsetX = (typeof offsetX == 'number' ? offsetX : 0),
                        offsetY = (typeof offsetY == 'number' ? offsetY : 0),
                        zoom = map.getZoom(),
                        scale = Math.pow( 2, zoom ),
                        northEast = map.getBounds().getNorthEast(),
                        southWest = map.getBounds().getSouthWest(),
                        width = Math.abs( northEast.lng() - southWest.lng() ),
                        height = Math.abs( northEast.lat() - southWest.lat() ),
                        point1 = map.getProjection().fromLatLngToPoint( map.getCenter() ),
                        point2 = new google.maps.Point(
                            offsetX / scale,
                            offsetY / scale
                        ),
                        centerPoint = new google.maps.Point(
                            point1.x - point2.x,
                            point1.y - point2.y
                        ),
                        center = map.getProjection().fromPointToLatLng( centerPoint );

                    if ( relative ) {
                        center = new google.maps.LatLng(
                            map.getCenter().lat() + height * offsetY / 100,
                            map.getCenter().lng() - width * offsetX / 100
                        );
                    }

                    map.setCenter( center );
                }

                function successCallback (data) {
                    if ( typeof data == 'object' ) {
                        if ( data.mapZoom ) mapOptions.zoom = data.mapZoom;

                        if ( data.relativeOffset ) relativeOffset = true;

                        if ( data.offsetX ) offsetX = data.offsetX;
                        else offsetX = 0;

                        if ( data.offsetY ) offsetY = data.offsetY;
                        else offsetY = 0;

                        if ( data.markerImagePath && typeof data.markerImagePath == 'string' ) icon = data.markerImagePath;

                        if ( data.markerAddress && typeof data.markerAddress == 'string' ) address = data.markerAddress;
                        else if ( data.markerLatLng && typeof data.markerLatLng == 'object' ) markerLatLng = new google.maps.LatLng(data.markerLatLng[0], data.markerLatLng[1]);

                        if ( data.balloons && typeof data.balloons == 'object' && data.balloons.length ) balloons = data.balloons;
                    }

                    geocoder = new google.maps.Geocoder();

                    if ( typeof markerLatLng == 'object' ) {
                        createMap();

                    }else if ( typeof address == 'string' ) {
                        geocoder.geocode({ 'address': address }, function(results, status) {
                            markerLatLng = results[0].geometry.location;

                            createMap();
                        });
                    }
                }

                function failCallback () {
                    _this.log("Can't parse map settings!");

                    new google.maps.Map(mapEl, {
                        center: new google.maps.LatLng(0, 0),
                        zoom: 2
                    });
                }

                if ( $(this).data('settings') ) {
                    $.getJSON($(this).data('settings'), successCallback).fail(failCallback);

                }else {
                    failCallback();
                }
            });
        }
    },

    masonryInit: function () {
        var _this = this;

        if ( $('.masonry').length && typeof $.fn.masonry == 'function' ) {
            $('.masonry').each(function () {
                var $container = $(this);

                $container.masonry({
                    itemSelector: '.masonry-item',
                    isAnimated: true,

                    columnWidth: function( containerWidth ) {
                        if ( containerWidth > 720 ) {
                            $container.removeClass('width400').removeClass('width720');
                            return containerWidth / 4;
                        }else if ( containerWidth > 400 ) {
                            $container.addClass('width720').removeClass('width400');
                            if ( $container.is('.speakers') ) return containerWidth / 2;
                            else return containerWidth / 3;
                        }else {
                            $container.addClass('width400').removeClass('width720');
                            if ( $container.is('.speakers') ) return containerWidth;
                            else return containerWidth / 2;
                        }
                    }
                });
            });
        }
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
        if ( $('header').length ) {
            var $header = $('header'),
                scrollTop = $(window).scrollTop(),
                headerTop = $header.offset().top;

            if ( scrollTop >= headerTop ) {
                this.stickMenu();

            }else {
                this.unstickMenu();
            }
        }
    },

    //onload handler
    windowLoadHeandler: function (event) {
        this.log('Window load handler');

        this.checkHeaderStatus();

        this.masonryInit();
    },

    //on resize handler
    windowResizeHandler: function (event) {
        this.checkMobile();

        this.windowHeightBlock();

        this.centeredBlock();

        this.calculateMenuSizes();
    },

    //on scroll handler
    windowScrollHandler: function (event) {
        this.checkHeaderStatus();
    },

    styleSwitcherHandler: function (event, $el) {
        event.preventDefault();

        var switcher = $('.style-switcher');

        if (switcher.hasClass('style-active')){
            switcher.animate({ marginLeft: '0' }, 200, 'linear');

        } else {
            switcher.animate({ marginLeft: '225' }, 200, 'linear');
        }

        switcher.toggleClass('style-active');
    },

    styleSwitcherColorHandler: function (event, $el) {
        var $this = $el,
            colorName = $this.attr('data-color');

        event.preventDefault();

        $('.style-switcher-css').remove();
        $('head').append('<link class="style-switcher-css" rel="stylesheet" type="text/css" href="assets/css/colors/' + colorName + '.css">');
    },

    styleSwitcherToggleAnimation: function (event, $el) {
        if ( $el.get(0).checked ) {
            $('.animated').css('opacity', '');
            this.options.animations = true;

        }else {
            $('.animated').css('opacity', 1);
            this.options.animations = false;
        }
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

        $(window).on('resize', function (event) {
            _this.windowResizeHandler(event);
        });

        $(window).on('scroll', function (event) {
            _this.windowScrollHandler(event);
        });

        $('.back-to-top').on('click', function (event) {
            event.preventDefault();

            _this.backToTopHandler();
        });

        $('.navbar-collapse').on( 'mousewheel DOMMouseScroll', function (event) {
            if ( _this.mobileDevice ) {
                var e0 = event.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;

                this.scrollTop -= delta;
                event.preventDefault();
            }
        });

        $('.style-toggle').on('click', function(event){
            _this.styleSwitcherHandler(event, $(this));
        });

        $('.style-switcher .color').on('click', function(event) {
            _this.styleSwitcherColorHandler(event, $(this));
        });

        $('#animations_switch').on('change', function(event){
            _this.styleSwitcherToggleAnimation(event, $(this));
        });

        this.log('Set event hendlers');
    },

    videoPosition: function () {
        var original_video_w = 1920;
        var original_video_h = 1080;
        var original_video_r = original_video_w/original_video_h;

        var video_wrapper_w = $('.video-bg').width();
        var video_wrapper_h = $('.video-bg').height();
        var video_wrapper_r = video_wrapper_w/video_wrapper_h;

        var css = {
            'position': 'absolute'
        };

        if( original_video_w > video_wrapper_w ) {
            var w_translation = (original_video_w - video_wrapper_w) / 2;
            css['left'] = -w_translation;
        }

        if( original_video_h > video_wrapper_h ) {
            var h_translation = (original_video_h - video_wrapper_h) * 0.6;
            css['top'] = -h_translation;
        }

        $('.video-bg video').css(css);
    },

    init: function (options) {
        this.options = $.extend(this.defaults, options, $('body').data());

        this.log('Init');

        this.checkMobile();

        if ( typeof google != 'undefined') this.initGoogleMap();

        this.windowHeightBlock();

        this.centeredBlock();

        this.calculateMenuSizes();

        this.setEventHandlers();

        this.videoPosition();
    }
}

$('.navigation-item').on( 'click', function (event) {
    if($('#navigation').hasClass('in')){
        $('#navigation').removeClass('in');
    }
});

$('.logo img').hover(function (event) {
    $('#logo_white').hide();
    $('#logo_blue').show();
}, function (event) {
    $('#logo_blue').hide();
    $('#logo_white').show();
});
