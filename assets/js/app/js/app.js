'use strict';

var app = angular.module('theboard',[
	'ngRoute',

	// modules
	'theboardControllers',
	'theboardDirectives'
]);

app.config(['$routeProvider',
	function($routeProvider) {
	$routeProvider.
		  when('/', {
		    templateUrl: 'partials/index.html',
		    controller: 'indexController'
		  }).
		  when('/home', {
		    templateUrl: 'partials/index.html',
		    controller: 'indexController'
		  }).
		  otherwise({
		    	templateUrl: 'partials/404.html',
		    	controller: 'errorController'
		  });
	}
]);