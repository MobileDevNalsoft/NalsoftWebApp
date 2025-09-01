/*-----------------------------------------------------------------------------------

    Note: This is Main JS File.
-----------------------------------------------------------------------------------
    JS INDEX
    ===================
    ## Header Style
    ## Dropdown menu
    ## Submenu
    ## Preloader
    
-----------------------------------------------------------------------------------*/
(function ($) {

    "use strict";

    $(document).ready(function () {

        // ## Header Style and Scroll to Top
        function headerStyle() {
            if ($('.main-header').length) {
                var windowpos = $(window).scrollTop();
                var siteHeader = $('.main-header');
                var scrollLink = $('.scroll-top');
                if (windowpos >= 250) {
                    siteHeader.addClass('fixed-header');
                    scrollLink.fadeIn(300);
                } else {
                    siteHeader.removeClass('fixed-header');
                    scrollLink.fadeOut(300);
                }
            }
        }
        headerStyle();


        // ## Dropdown menu
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');

        navcollapse.on('mouseenter mouseleave', function () {
            if ($(window).innerWidth() >= mobileWidth) {
                $(this).children('ul').stop(true, false, true).slideToggle(300);
                $(this).children('.megamenu').stop(true, false, true).slideToggle(300);
            }
        });


        // ## Submenu Dropdown Toggle
        if ($('.navigation li.dropdown ul').length) {
            $('.navigation li.dropdown').append('<div class="dropdown-btn"><span class="far fa-angle-down"></span></div>');
            console.log('dropdown-btn');
            //Dropdown Button
            $('.main-header .navigation li.dropdown .dropdown-btn').on('click', function () {
                $(this).prev('ul').slideToggle(500);
                $(this).prev('.megamenu').slideToggle(800);
            });

        }

        //Submenu Dropdown Toggle
        if ($('.main-header .main-menu').length) {
            $('.main-header .main-menu .navbar-toggle').on('click', function () {
                $(this).prev().prev().next().next().children('li.dropdown').hide();
            });
        }

        // ## Scroll to Top
        if ($('.scroll-to-target').length) {
            $(".scroll-to-target").on('click', function () {
                var target = $(this).attr('data-target');
                // animate
                $('html, body').animate({
                    scrollTop: $(target).offset().top
                }, 1000);

            });
        }

        // ## Menu Hidden Sidebar Content Toggle
        if ($('.menu-sidebar').length) {
            //Show Form
            $('.menu-sidebar').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('side-content-visible');
            });
            //Hide Form
            $('.hidden-bar .inner-box .cross-icon,.form-back-drop,.close-menu').on('click', function (e) {
                e.preventDefault();
                $('body').removeClass('side-content-visible');
            });
            //Dropdown Menu
            $('.fullscreen-menu .navigation li.dropdown > a').on('click', function () {
                $(this).next('ul').slideToggle(500);
            });
        }


        // ## Search Box
        $('.nav-search > button').on('click', function () {
            $('.nav-search form').toggleClass('hide');
        });

        // Hero side carousel (auto-rotate)
        (function(){
            var $slides = $('.hero-side-carousel .carousel-slide');
            if(!$slides.length) return;
            var idx = 0;
            function show(i){
                $slides.removeClass('active').eq(i).addClass('active');
            }
            show(idx);
            setInterval(function(){
                idx = (idx + 1) % $slides.length;
                show(idx);
            }, 3500);
        })();

        // Hero left rotator (replace static text with auto-carousel)
        (function(){
            var $slides = $('.hero-rotator .hero-rotator-slide');
            if(!$slides.length) return;
            var idx = 0;
            var duration = 4500;
            function show(i){
                $slides.removeClass('active').eq(i).addClass('active');
            }
            show(idx);
            setInterval(function(){
                idx = (idx + 1) % $slides.length;
                show(idx);
            }, duration);
        })();

        // Enhanced Client Logo Slider with Intersection Observer
        (function(){
            var $clientSlider = $('.client-logo-active');
            if(!$clientSlider.length) return;
            
            var autoplayStarted = false;
            var autoplayDelay = 2000; // 2 seconds delay after section becomes visible
            
            // Function to start autoplay
            function startAutoplay() {
                if (!autoplayStarted) {
                    setTimeout(function() {
                        $clientSlider.slick('slickPlay');
                        $clientSlider.addClass('autoplay-active');
                        autoplayStarted = true;
                    }, autoplayDelay);
                }
            }
            
            // Function to stop autoplay
            function stopAutoplay() {
                $clientSlider.slick('slickPause');
                $clientSlider.removeClass('autoplay-active');
                autoplayStarted = false;
            }
            
            // Intersection Observer to detect when slider is visible
            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            startAutoplay();
                        } else {
                            stopAutoplay();
                        }
                    });
                }, {
                    threshold: 0.3, // Trigger when 30% of the section is visible
                    rootMargin: '0px 0px -100px 0px'
                });
                
                observer.observe($clientSlider[0]);
            } else {
                // Fallback for older browsers
                startAutoplay();
            }
            
            // Handle manual navigation
            $clientSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                // Pause autoplay during manual navigation
                $(this).removeClass('autoplay-active');
            });
            
            $clientSlider.on('afterChange', function(event, slick, currentSlide) {
                // Resume autoplay after manual navigation with delay
                setTimeout(function() {
                    if (autoplayStarted) {
                        $(this).addClass('autoplay-active');
                    }
                }.bind(this), 3000);
            });
            
            // Pause on hover when autoplay is active
            $clientSlider.on('mouseenter', function(){
                if (autoplayStarted) {
                    $(this).find('.slick-track').css('transition-play-state', 'paused');
                }
            });
            
            $clientSlider.on('mouseleave', function(){
                if (autoplayStarted) {
                    $(this).find('.slick-track').css('transition-play-state', 'running');
                }
            });
            
            // Ensure arrows are properly styled and clickable
            $clientSlider.on('init', function(){
                var $arrows = $(this).find('.client-arrow-prev, .client-arrow-next');
                $arrows.show();
                
                // Add click handlers for arrows
                $arrows.off('click.clientSlider').on('click.clientSlider', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var $slider = $(this).closest('.client-logo-active');
                    if ($(this).hasClass('client-arrow-prev')) {
                        $slider.slick('slickPrev');
                    } else {
                        $slider.slick('slickNext');
                    }
                });
            });
            
            // Handle touch/swipe events
            $clientSlider.on('touchstart mousedown', function() {
                if (autoplayStarted) {
                    $(this).removeClass('autoplay-active');
                }
            });
            
            $clientSlider.on('touchend mouseup', function() {
                if (autoplayStarted) {
                    setTimeout(function() {
                        $(this).addClass('autoplay-active');
                    }.bind(this), 2000);
                }
            });
        })();

    });


    /* ==========================================================================
       When document is resize, do
    ========================================================================== */

    $(window).on('resize', function () {
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');
        navcollapse.children('ul').hide();
        navcollapse.children('.megamenu').hide();

    });


    $(window).on('scroll', function () {

        // Header Style and Scroll to Top
        function headerStyle() {
            if ($('.main-header').length) {
                var windowpos = $(window).scrollTop();
                var siteHeader = $('.main-header');
                var scrollLink = $('.scroll-top');
                if (windowpos >= 100) {
                    siteHeader.addClass('fixed-header');
                    scrollLink.fadeIn(300);
                } else {
                    siteHeader.removeClass('fixed-header');
                    scrollLink.fadeOut(300);
                }
            }
        }

        headerStyle();

    });

    /* ==========================================================================
       When document is loaded, do
    ========================================================================== */

    $(window).on('load', function () {

        // ## Preloader
        function handlePreloader() {
            if ($('.preloader').length) {
                $('.preloader').delay(200).fadeOut(500);
            }
        }
        handlePreloader();

    });

})(jQuery);
