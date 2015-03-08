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
            // Board layout
            .state('board', {
                abstract: true,
                templateUrl: APP_CONFIG.routes.partials + '/board.html',
                ncyBreadcrumb: {
                    //skip: true
                    label: 'Board'
                }
            })
            // Static sidebar layout
            .state('static', {
                abstract: true,
                templateUrl: APP_CONFIG.routes.partials + '/static.html',
                ncyBreadcrumb: {
                    label: 'Board',
                    breadcrumbProxy: 'board.index'
                }
            })
            // Home state
            .state('board.index', {
                url: '/',
                templateUrl: APP_CONFIG.routes.partials + '/board.index.html',
                controller: 'IndexController',
                data: {
                    target: 'board'
                },
                pageTitle: 'Board',
                ncyBreadcrumb: {
                    label: 'Board'
                    //skip: true
                }
            })
            .state('static.settings', {
                abstract: true,
                url: '/settings',
                templateUrl: APP_CONFIG.routes.partials + '/static.settings.html',
                controller: 'SettingsController',
                controllerAs: 'settingsCtl',
                ncyBreadcrumb: {
                    label: 'Settings'
                }
            })
            .state('static.settings.general', {
                url: '/general',
                templateUrl: APP_CONFIG.routes.partials + '/settings.general.html',
                controller: 'SettingsGeneralController',
                controllerAs: 'settingsGeneralCtl',
                pageTitle: 'General settings',
                ncyBreadcrumb: {
                    label: 'General'
                }
            })
            .state('static.settings.board', {
                url: '/board',
                templateUrl: APP_CONFIG.routes.partials + '/settings.board.html',
                controller: 'SettingsBoardController',
                controllerAs: 'settingsBoardCtl',
                pageTitle: 'Board settings',
                ncyBreadcrumb: {
                    label: 'Board'
                }
            })
            .state('static.settings.account', {
                url: '/account',
                templateUrl: APP_CONFIG.routes.partials + '/settings.account.html',
                controller: 'SettingsAccountController',
                controllerAs: 'settingsAccountCtl',
                pageTitle: 'Account settings',
                ncyBreadcrumb: {
                    label: 'Profile'
                }
            })
            .state('static.profile', {
                url: '/profile',
                templateUrl: APP_CONFIG.routes.partials + '/static.profile.html',
                controller: 'AccountController',
                controllerAs: 'accountCtl',
                pageTitle: 'Profile',
                ncyBreadcrumb: {
                    label: 'Profile'
                }
            })
            .state('static.widgetProfiles', {
                url: '/widget-profiles',
                templateUrl: APP_CONFIG.routes.partials + '/widget-profiles.html',
                controller: 'WidgetProfilesController',
                controllerAs: 'widgetProfilesCtl',
                pageTitle: 'Widget profiles',
                ncyBreadcrumb: {
                    label: 'Widget profiles'
                }
            })
            .state('static.widgetProfilesDetail', {
                url: '/widget-profiles/detail/:id',
                templateUrl: APP_CONFIG.routes.partials + '/widget-profiles.detail.html',
                controller: 'WidgetProfilesDetailController',
                controllerAs: 'WidgetProfilesDetailCtl',
                pageTitle: 'Widget profiles',
                ncyBreadcrumb: {
                    label: 'Detail'
                }
            });
    }

})();
