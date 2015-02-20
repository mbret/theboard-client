(function() {
    'use strict';

    angular
        .module('app.core')
        .config(configureRoutes);

    configureRoutes.$inject = ['$urlRouterProvider', '$stateProvider', 'APP_CONFIG'];

    /**
     * @todo read http://www.jvandemo.com/how-to-resolve-application-wide-resources-centrally-in-angularjs-with-ui-router/
     * @todo read https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
     * @todo read http://www.funnyant.com/angularjs-ui-router/
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
                abstract: true,
                url: '/settings',
                templateUrl: APP_CONFIG.routes.partials + '/settings.html',
                controller: 'SettingsController',
                controllerAs: 'settingsCtl'
            })
            .state('settings.general', {
                url: '/general',
                templateUrl: APP_CONFIG.routes.partials + '/settings.general.html',
                controller: 'SettingsGeneralController',
                controllerAs: 'settingsGeneralCtl',
                data: {
                    pageTitle: 'General settings'
                }
            })
            .state('settings.board', {
                url: '/board',
                templateUrl: APP_CONFIG.routes.partials + '/settings.board.html',
                controller: 'SettingsBoardController',
                controllerAs: 'settingsBoardCtl',
                data: {
                    pageTitle: 'Board settings'
                }
            })
            .state('settings.account', {
                url: '/account',
                templateUrl: APP_CONFIG.routes.partials + '/settings.account.html',
                controller: 'SettingsAccountController',
                controllerAs: 'settingsAccountCtl',
                data: {
                    pageTitle: 'Account settings'
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: APP_CONFIG.routes.partials + '/profile.html',
                controller: 'AccountController',
                controllerAs: 'accountCtl',
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
            .state('widget-profiles-detail', {
                url: '/widget-profiles/detail/:id',
                templateUrl: APP_CONFIG.routes.partials + '/widget-profiles.detail.html',
                controller: 'WidgetProfilesDetailController',
                controllerAs: 'WidgetProfilesDetailCtl',
            })
    }

})();
