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
        .then(function( config ){

            // Then bootstrap application
            angular.module('app.core')
				.constant('APP_CONFIG', config)
				.constant('USER', window.USER);
            angular.element(document).ready(function() {
                angular.bootstrap(document, ["app"]);
            });
        })
		.catch(function(err){
			display500();
		});

	/**
	 * Load the app configuration from server
	 * Return the $get promise
	 * @returns {*}
	 */
	function loadServerConfig() {
        return new Promise(function(resolve, reject){
            return resolve(window.APP_CONFIG);
        });
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
