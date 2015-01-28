

// Here are definition of application constant
// We get the settings from the server
angular
    .module('app')
    //.constant('settings', window.settings)

    // Toaster configuration
    // The configuration come from the server
    .config(['toastrConfig', 'config', function(toastrConfig, config){
        angular.extend(toastrConfig, config.toastr);
    }])

    // ...
    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise("/");
            $stateProvider
                // Home state
                .state('board', {
                    url: '/',
                    templateUrl: 'app/partials/board.html',
                    controller: 'IndexController',
                    data: {
                        pageTitle: 'Board'
                    }
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'app/partials/settings.html',
                    controller: 'SettingsController',
                    data: {
                        pageTitle: 'Settings'
                    }
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'app/partials/profile.html',
                    controller: 'ProfileController',
                    data: {
                        pageTitle: 'Profile'
                    }
                })
    }])

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    }])

    .run(function($rootScope, $state, $http, $log, notifService, $timeout, config){

        $rootScope.$state = $state;

        // Check for flash message from server
        // These message can come from login/logout/etc
        // We display it after Pace is hidden.
        // @todo if you have a better idea in order to not use directly Pace here give it
        Pace.on('hide', function(){
            $http.get(config.routes.flash).then(function(data){
                $log.debug(data.data);
                var messages = data.data;

                if(messages.errors){
                    notifService.error(messages.errors)
                }
                if(messages.warnings){
                    notifService.warning(messages.warnings)
                }
                if(messages.success){
                    notifService.success(messages.success)
                }
                if(messages.info){
                    notifService.info(messages.info)
                }
            });
        });

    });