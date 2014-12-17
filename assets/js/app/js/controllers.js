'use strict';

var controllersModule = angular.module('theboardControllers', []);

// app = angular.module('theboard')
controllersModule.controller("indexController", ['$scope', '$http', 'batchLog', function($scope, $http, batchLog){

	$scope.app = {};
	$scope.app.widgets = [
		{
			name: 'meteo',
			title: 'Widget meteo',
			templateURL: 'js/app/widgets/meteo/widget.html'
		},
		{
			name: 'news',
			title: 'Widget news',
			templateURL: 'js/app/widgets/news/widget.html'
		}
	];

	console.log($scope);
	// Use a service
	batchLog('Hello');

	console.log('salut');

}]);

controllersModule.controller("errorController", ['$scope', '$http', 'batchLog', function($scope, $http, batchLog){

    $scope.init = function() {

    	// Use a service
    	batchLog('Hello');

    };

}]);