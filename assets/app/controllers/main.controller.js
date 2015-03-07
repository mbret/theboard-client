(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('MainController', MainController)

    MainController.$inject = ['$rootScope', '$scope', '$http', '$state', 'user', '$log', '$animate', 'widgetService', 'geolocationService', 'backstretch', 'APP_CONFIG'];

    /**
     * USE THIS CONTROLLER AS LESS AS POSSIBLE (bad practice)
     * Usually if you need something to go here you should probably make a directive or service !
     */
    function MainController($rootScope, $scope, $http, $state, user, $log, $animate, widgetService, geolocationService, backstretch, APP_CONFIG){

        /**
         * Lib used: https://github.com/TalAter/annyang
         * Google test speech recognition: http://www.google.com/intl/fr/chrome/demos/speech.html
         *
         * On http site the authorization will pop every time, not on https
         */
        var commands = {
            'Widgets* refresh': function() {
                alert('Widgets are refreshing');
            },
            'Widgets* stop': function() {
                alert('Widgets are stopped!');
            }
        };

        $scope.href = {
            logout: APP_CONFIG.routes.logout
        };

        //$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        //   console.log(fromState, toState);
        //});

        //annyang.debug();
        //annyang.addCommands(commands);
        //annyang.start();


    };
})();
