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
	 */
	var app = angular.module('app',[

		'ui.router',
		'ui.bootstrap',
		'ngAnimate',
		'gridster',

		'blocks.exception', // wrap angular exception handling
		'blocks.logger', // wrap angular logging
		'blocks.pageTitle',

		'app.services',
		'app.controllers',
		'app.directives',

	]);

	/*
	 * Bootstrap application
	 */
	loadServerConfig()
		.then(function() {
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
		var initInjector = angular.injector(["ng"]);
		var $http = initInjector.get("$http");
		var $log = initInjector.get('$log');

		return $http.get("/configuration.json").then(function(response) {
			
			var config = response.data;
			// Add gridster configuration
			config.gridsterOpts = {
				columns: 6, // the width of the grid, in columns
				width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
				colWidth: 300, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
				margins: [20, 20], // the pixel distance between each widget
				outerMargin: true, // whether margins apply to outer edges of the grid,
				floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
				resizable: {
					enabled: false,
					handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
					start: function(event, $element, widget) {}, // optional callback fired when resize is started,
					resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
					stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
				},
				draggable: {
					enabled: false, // whether dragging items is supported
					handle: '.gridster-draggable', // optional selector for resize handle
					start: function(event, $element, widget) {}, // optional callback fired when drag is started,
					drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
					stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
				}
			};
			// Add new constant
			app.constant('test', 'HAAHAH');
			app.constant('config', config); // @todo not used for now
			//app.config(function($provide){
			//	$provide.constant('config', config);
			//})
			window.appConfig = config; // used to pass to other module
			return;
		})
		.catch(function(errorResponse) {
			throw errorResponse;
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
