(function() {
    'use strict';

    angular
        .module('app.core')
        .config(configureRoutes);

    configureRoutes.$inject = ['$urlRouterProvider', '$stateProvider', 'APP_CONFIG'];

    /**
     * @todo read http://www.jvandemo.com/how-to-resolve-application-wide-resources-centrally-in-angularjs-with-ui-router/
     * @param $urlRouterProvider
     * @param $stateProvider
     * @param APP_CONFIG
     */
    function configureRoutes($urlRouterProvider, $stateProvider, APP_CONFIG) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            // Home state
            .state('board', {
                url: '/',
                templateUrl: APP_CONFIG.routes.partials + '/board.html',
                controller: 'IndexController',
                data: {
                    pageTitle: 'Board'
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: APP_CONFIG.routes.partials + '/settings.html',
                controller: 'SettingsController',
                data: {
                    pageTitle: 'Settings'
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: APP_CONFIG.routes.partials + '/profile.html',
                controller: 'ProfileController',
                data: {
                    pageTitle: 'Profile'
                }
            })
            .state('widget-profiles', {
                url: '/widget-profiles',
                templateUrl: APP_CONFIG.routes.partials + '/widget-profiles.html',
                controller: 'WidgetProfilesController',
                controllerAs: 'widgetProfilesCtl',
                data: {
                    pageTitle: 'Widget profiles'
                }
            })
    }

})();
