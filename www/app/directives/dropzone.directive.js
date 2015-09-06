(function(){
    'use strict';

    /**
     *
     */
    angular
        .module('app.directives')
        .directive('dropzone', dropzone);

    dropzone.$inject = ['$timeout', 'Dropzone'];

    /**
     *
     */
    function dropzone ($timeout, Dropzone){

        return {
            restrict: 'A',
            scope: {
                config: '=dropzoneConfig'
                
            },
            link: function($scope, element, $attrs) {
                var defaultConfig = {
                    'method': 'post',
                    maxFilesize: 10
                };
                var config = angular.extend(defaultConfig, $scope.config);
                var dropzone = new Dropzone(element[0], config);

                dropzone.on('addedfile', function(file){

                });
                dropzone.on('success', function(file, json){
                    var dzself = this;
                    $timeout(function(){
                        dzself.removeFile(file);
                    }, 2000);
                });
                dropzone.on('addedfile', function(file) {

                });
                dropzone.on('drop', function(file) {

                });
            }
        };
    }
})();
