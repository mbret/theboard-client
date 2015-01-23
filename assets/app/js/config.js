

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

    .run(function($rootScope, $state){

        $rootScope.$state = $state;
        //console.log(window.settings);
        //
        //// Get Jquery element
        //var $body = angular.element('body');
        //
        //var stack = window.settings.user.backgroundImages;
        //
        //changeBG();
        //setInterval(changeBG, 10000);
        //
        //function changeBG(){
        //	var current = stack.shift();
        //	$body.css({backgroundImage: 'url("' + window.settings.paths.images + '/' + current + '")'});
        //	stack.push(current);
        //}

    });