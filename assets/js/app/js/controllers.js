'use strict';

var controllersModule = angular.module('theboardControllers', []);

// app = angular.module('theboard')
controllersModule.controller("indexController", ['$scope', '$http', '$window', 'batchLog', function($scope, $http, $window, batchLog){


	$scope.app = {};
	$scope.app.commonLib = {
		identity: 'Common library'
	};
	$scope.app.widgetsToLoad = [
		{
			identity: 'Widget meteo',
			identityHTML: 'widget-meteo',
			url: 'js/app/widgets/meteo/widget.html'
		},
		{
			identity: 'Widget meteo2',
			identityHTML: 'widget-meteo2',
			url: 'js/app/widgets/meteo2/widget.html'
		}
	];

	$scope.app.widgets = []; // this array will be filled after each widget loaded

	$scope.refreshWidgets = function(){
		for(var identity in $scope.app.widgets){
			$scope.app.widgets[identity].refresh();
		}
	};

	$scope.stopWidgets = function(){
		for(var identity in $scope.app.widgets){
			$scope.app.widgets[identity].stop();
		}
	};

	$scope.startWidgets = function(){
		for(var identity in $scope.app.widgets){
			$scope.app.widgets[identity].start();
		}
	};

	console.log($scope);
	// Use a service
	batchLog('Hello');


}]);

controllersModule.controller("errorController", ['$scope', '$http', 'batchLog', function($scope, $http, batchLog){

    $scope.init = function() {

    	// Use a service
    	batchLog('Hello');

    };

}]);