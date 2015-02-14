'use strict';

/**
 * - Best practice for directory structure (http://scotch.io/tutorials/angularjs-best-practices-directory-structure)
 * - Here is the official angular styleguide: (https://github.com/johnpapa/angularjs-styleguide)
 *
 * http://briantford.com/blog/huuuuuge-angular-apps (perf etc)
 */

(function () {
	
	/*
	 * Define app and its dependencies
	 * - Will run
	 *      - constants for each modules
	 *      - config for each modules in order
	 *      - run for each modules in order
	 */
	var app = angular.module('app',[
        'app.core',
	]);

	/*
	 * Bootstrap application
	 */
    // Load server configuration first
	loadServerConfig()
        // Then check authenticated user
		.then(function( config ){
            return checkAuth( config).then(function(user){
                config.user = user;
                return config;
            });
		})
        // Then bootstrap application
        .then(function( config ){
            angular.module('app.config').constant('APP_CONFIG', config);
            angular.element(document).ready(function() {
                angular.bootstrap(document, ["app"]);
            });
        })
		.catch(function(err){
			display500();
		});

    /**
     * Check the authentication of user.
     * To access the application a token must be available and valid
     * in order to retrieve current logged user. 
     * @param config
     * @returns {*}
     */
    function checkAuth(config){

        //var APP_CONFIG = config;
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");
        //var $log = initInjector.get('$log');
        //var $window = initInjector.get('$window');
        //var $localStorage = $window.localStorage;
        //var token = $localStorage.token;

        // No token redirect
        //if( ! token ){
        //    redirectToLogin();
        //}
        //else{
            // check token
            return $http.get( config.routes.api.me)
                .then(function(response){
                    console.log('SZASA');

                    var data = response.data;
                    var user = data;
                    return user;
                });
                //.catch(function(err){
                    //if(err.status === 403){
                    //    console.log('redirect');
                    //    redirectToLogin();
                    //}
                    //else{
                    //    throw err;
                    //}
                //});
        //}
        
        //function redirectToLogin(){
        //    window.location.replace('https://localhost:1337' + '/signin' + '?source=');
        //}
        
    }
    
	/**
	 * Load the app configuration from server
	 * Return the $get promise 
	 * @returns {*}
	 */
	function loadServerConfig() {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");
        var $log = initInjector.get('$log');
        var $q = initInjector.get('$q');
        return $q(function(resolve, reject) {
            resolve(window.APP_CONFIG);
        });

		
        //
		//return $http.get("/configuration.json").then(function(response) {
		//
		//	var config = response.data;

		//	return config;
		//})
		//.catch(function(errorResponse) {
		//	throw errorResponse;
		//});
	}

	/**
	 * Display error 500 on startup fail
	 * remove all style and display simple message
	 */
	function display500(){
		$('link[rel=stylesheet]').remove();
		$('body').html('Application error, try to restart the application');
	}

})();
