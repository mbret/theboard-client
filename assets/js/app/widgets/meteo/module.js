angular.module('widgetMeteo', [])

  	// .run(function(user) {
   //  	user.load('World');
  	// })

  	.controller('initController', function($scope){
    	
    	console.log('widget meteo loaded');

    	$scope.init()

  	});