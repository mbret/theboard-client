(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('MainController', MainController)

    MainController.$inject = ['$rootScope', '$scope', '$http', '$state', 'user', '$log', '$animate', 'widgetService', 'geolocationService', 'backstretch'];

    /**
     * USE THIS CONTROLLER AS LESS AS POSSIBLE (bad practice)
     * Usually if you need something to go here you should probably make a directive or service !
     */
    function MainController($rootScope, $scope, $http, $state, user, $log, $animate, widgetService, geolocationService, backstretch){

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

        // backstretch take an array of url so we take settings
        // and create an array with image and url
        var urls = [];
        angular.forEach(user.backgroundImages, function(image){
            urls.push(image);
        });
        $scope.backstretch = urls;

        // Watch routing states change
        $rootScope.$on('$stateChangeStart', function watchStateChanges(event, toState, toParams, fromState, fromParams){
            if(toState.name === 'board'){
                backstretch.resume();
            }
            else{
                backstretch.destroy();
            }
        });
        
        // We toggle backstretch state when toggling sidebar to reduce (graphical frame drop)
        $rootScope.$on('sidebar.open', function(){
            if($state.current.name === 'board') backstretch.pause();
        });
        $rootScope.$on('sidebar.opened', function(){
            if($state.current.name === 'board') backstretch.resume();
        });
        $rootScope.$on('sidebar.close', function(){
            if($state.current.name === 'board') backstretch.pause();
        });
        $rootScope.$on('sidebar.closed', function(){
            if($state.current.name === 'board') backstretch.resume();
        });
        
        //annyang.debug();
        //annyang.addCommands(commands);
        //annyang.start();


    };
})();