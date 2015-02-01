(function() {
    'use strict';

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$urlRouterProvider', '$stateProvider', 'config'];
    function configureRoutes($urlRouterProvider, $stateProvider, config) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            // Home state
            .state('board', {
                url: '/',
                templateUrl: config.routes.partials + '/board.html',
                controller: 'IndexController',
                data: {
                    pageTitle: 'Board'
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: config.routes.partials + '/settings.html',
                controller: 'SettingsController',
                data: {
                    pageTitle: 'Settings'
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: config.routes.partials + '/profile.html',
                controller: 'ProfileController',
                data: {
                    pageTitle: 'Profile'
                }
            })
    }

})();
