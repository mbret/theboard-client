(function() {
    'use strict';

    /**
     * Directives can be used to:
     * - create a custom button my-button which has some event listener ...
     *      ex: http://twofuckingdevelopers.com/2014/06/angularjs-best-practices-001-constants/
     *
     * - Directives can get constant vars to help manage events, etc without typo problem
     *  ex: http://twofuckingdevelopers.com/2014/06/angularjs-best-practices-001-constants/
     */

    angular
        .module('app.directives')

        /**
         * Control the sidebar component
         * For now it only reset the state when route change. In that way the sidebar is always reset when user leave the /board state
         */
        .directive('sidebar', ['$rootScope', '$timeout', 'APP_CONFIG', 'sidebarService', 'user', '$window', '$location',
            function($rootScope, $timeout, APP_CONFIG, sidebarService, user, $window, $location){
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {

                        scope.close = function(){
                            sidebarService.close();
                        }
                        
                        scope.logout = function(){
                            delete $window.localStorage.token;
                            $window.location.replace(APP_CONFIG.routes.signin);
                        }

                        scope.user = {
                            avatar: user.avatar,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            displayName: user.firstName ? user.firstName : user.email
                        };

                        // get eventual attribute
                        // sidebar-close="" define who whant a sidebar closed at state change
                        var stateWhoWhantSidebarClosed = attrs.sidebarClose;

                        // Reset sidebar when the route is changed
                        //
                        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                            if(toState.name == stateWhoWhantSidebarClosed){
                                sidebarService.close();
                            }
                            else{
                                sidebarService.putStatic(); // put static (disable backdrop)
                            }
                        });
                    }
                }
            }
        ]);
})();



