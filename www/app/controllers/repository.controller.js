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
        $scope.locationSelected = 'local';
        $scope.data = {};
        $scope.data.widgets = [];

        /**
         * Update location filters for repository display
         * @param label
         */
        $scope.browse = function(label){
            $scope.locationSelected = label;
            retrieveWidgetsFromRepository(label);
        };

        /**
         * Update widgets belonging to the profile
         * @param widget
         */
        $scope.toggleWidgetActivation = function(widget){
            if(widget.activated){
                widgetService
                    .remove(widget.identity, user.profile, $scope.locationSelected)
                    .then(function(){
                        widget.activated = false;
                    });
            }
            else{
                widgetService
                    .add(widget.identity, user.profile, $scope.locationSelected)
                    .then(function(){
                        widget.activated = true;
                    });
            }
        };

        function retrieveWidgetsFromRepository(label){
            return $q
                .all([
                    // get repository first time
                    RepositoryService.browse($scope.locationSelected),
                    // get actives widgets
                    widgetService.getAll(user.profile)
                ])
                .then(function(responses){

                    // responses[0] contain an array of widgets information
                    // responses[1] contain an array of widgets active for this user

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

        $scope.browse($scope.locationSelected);

    };

})();
