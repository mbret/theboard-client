(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('RepositoryController', RepositoryController)

    RepositoryController.$inject = ['$rootScope', '$scope', '$http', '$state', 'user', 'widgetProfilesService', '$animate', 'widgetService', '$q', 'RepositoryService', 'APP_CONFIG'];

    /**
     *
     */
    function RepositoryController($rootScope, $scope, $http, $state, user, widgetProfilesService, $animate, widgetService, $q, RepositoryService, APP_CONFIG){

        $scope.parent.title = 'Repository'
        $scope.shown = 'local';
        $scope.data = {};
        $scope.data.widgets = [];

        console.log(user);

        /**
         * Update location filters for repository display
         * @param label
         */
        $scope.show = function(label){
            $scope.shown = label;
            retrieveWidgetsFromRepository(label);
        };

        /**
         * Update widgets belonging to the profile
         * @param widget
         */
        $scope.activate = function(widget){
            if(widget.activated){
                widgetService
                    .removeFromProfile(widget.identity, user.profile, $scope.shown)
                    .then(function(){
                        widget.activated = false;
                    })
            }
            else{
                widgetService
                    .addToProfile(widget.identity, user.profile, $scope.shown)
                    .then(function(){
                        widget.activated = true;
                    })
            }
        };

        $scope.show($scope.shown);

        function retrieveWidgetsFromRepository(label){
            return $q
                .all([
                    // get repository first time
                    RepositoryService.browse($scope.shown),
                    // get actives widgets
                    widgetService.getAll()
                ])
                .then(function(responses){
                    //$scope.data.widgets = responses[0];
                    $scope.data.widgets = responses[0];
                    var widgetsFromProfile = responses[1];

                    // Thanks to the profile widgets we can set the 'activated' attribute for each widgets from repo
                    widgetsFromProfile.forEach(function(widgetFromProfile){
                        $scope.data.widgets.forEach(function(widget){
                           if(widget.identity === widgetFromProfile.identity){
                               widget.activated = true;
                           }
                        });
                    });
                });
        }
    };

})();
