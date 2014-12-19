'use strict';

var app = angular.module('theboard',[
	'ngRoute',
	'gridster',

	// modules
	'theboardControllers',
	'theboardDirectives'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'app/partials/index.html',
				controller: 'indexController'
			}).
			otherwise({
				templateUrl: 'app/partials/index.html',
				controller: 'indexController'
			});
	}
]);