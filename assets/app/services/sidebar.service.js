(function () {
    'use strict';

    /**
     * This is BAAAAAAAAAAAAAD practices to use jquery like this
     * @todo animate
     * @todo don't use jquery
     */
    angular
        .module('app')
        .factory('sidebarService', sidebarService);

    sidebarService.$inject = ['$log', '$rootScope', 'logger'];

    function sidebarService($log, $rootScope, logger) {

        var service = {

            EVENTS: {
                OPEN: 'sidebar.open',
                OPENED: 'sidebar.opened',
                CLOSE: 'sidebar.close',
                CLOSED: 'sidebar.closed'
            },

            close: close,

            open: open,

            toggle: function( cb ){
                logger.debug('sidebar toggle');
                var self = this;
                if ($('.sidebar').hasClass('sidebar-closed')) {
                    self.open( cb );
                }
                else{
                    self.close( cb );
                }
            },

            // Put the sidebar in static state (disable backdrop but let open the sidebar)
            putStatic: function(){
                var self = this;
                if(! this.isOpen()) self.open();
                $('.sidebar-backdrop').removeClass('active');
            },
            isOpen: isOpen
        };
    
        return service;
        
        function isOpen(){
            var $sidebar = $('.sidebar');
            if( $sidebar.hasClass('sidebar-open') ){
                return true;
            }
            return false;
        }
        
        function open( cb ){
            logger.debug("sidebar open");
            $rootScope.$broadcast('sidebar.open');

            var $sidebar = $('.sidebar');
            $sidebar.removeClass('sidebar-closed');
            $sidebar.addClass('sidebar-open');
            $('.sidebar-backdrop').addClass('active');

            $sidebar.one(whichTransitionEvent($sidebar), function(e){
                $rootScope.$broadcast('sidebar.opened');
                $rootScope.$apply();
                if(cb) cb();
            });
        }
        
        function close( cb ){
            logger.debug("sidebar close");
            $rootScope.$broadcast('sidebar.close');

            var $sidebar = $('.sidebar');
            $sidebar.removeClass('sidebar-open');
            $sidebar.addClass('sidebar-closed');
            $('.sidebar-backdrop').removeClass('active');

            $sidebar.one(whichTransitionEvent($sidebar), function(e){
                $rootScope.$broadcast('sidebar.closed');
                $rootScope.$apply();
                if(cb) cb();
            });
        }
        
        function whichTransitionEvent( el ){
            var t;
            var el = el[0]; // get raw
            var transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            }

            for(t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        }

        function whichAnimationEvent( el ){
            var t;
            var el = el[0]; // get raw
            var animations = {
                "animation"      : "animationend",
                "OAnimation"     : "oAnimationEnd",
                "MozAnimation"   : "animationend",
                "WebkitAnimation": "webkitAnimationEnd"
            }

            for (t in animations){
                if (el.style[t] !== undefined){
                    return animations[t];
                }
            }
        }

    }

})();