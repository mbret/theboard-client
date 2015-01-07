'use strict';

/**
 * - Bet practice for directory structure (http://scotch.io/tutorials/angularjs-best-practices-directory-structure)
 * - Here is the official angular styleguide: (https://github.com/johnpapa/angularjs-styleguide)
 */

window.settings.gridsterOpts = {
	columns: 6, // the width of the grid, in columns
	//pushing: true, // whether to push other items out of the way on move or resize
	//floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
	//swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
	width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
	colWidth: 300, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
	//rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
	margins: [20, 20], // the pixel distance between each widget
	outerMargin: true, // whether margins apply to outer edges of the grid
	//isMobile: true, // stacks the grid items if true
	//mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
	//mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
	//minColumns: 1, // the minimum columns the grid must have
	//minRows: 2, // the minimum height of the grid, in rows
	//maxRows: 100,
	//defaultSizeX: 2, // the default width of a gridster item, if not specifed
	//defaultSizeY: 1, // the default height of a gridster item, if not specified
	//minSizeX: 1, // minimum column width of an item
	//maxSizeX: null, // maximum column width of an item
	//minSizeY: 1, // minumum row height of an item
	//maxSizeY: null, // maximum row height of an item
	resizable: {
		enabled: true,
		handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
		start: function(event, $element, widget) {}, // optional callback fired when resize is started,
		resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
		stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
	},
	draggable: {
		enabled: true, // whether dragging items is supported
		handle: '.widget-dragger-button', // optional selector for resize handle
		start: function(event, $element, widget) {}, // optional callback fired when drag is started,
		drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
		stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
	}
};

// Attache extern module
//if()


angular
	.module('app',[
		'ngRoute',
		'ngMaterial',
		'gridster',

		// modules
		// modules are loaded at the time
		'app.services',
		'app.controllers',
		'app.directives',
	])

	// Here are definition of application constant
	// We get the settings from the server
	.constant('settings', window.settings)

	// ...
	.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'app/partials/board.html',
				controller: 'IndexController'
			}).
			when('/settings', {
				templateUrl: 'app/partials/settings.html',
				controller: 'SettingsController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}])

	.config(['$mdThemingProvider', function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryColor('pink')
			.accentColor('orange')
			.backgroundColor('grey');
	}])


	.run(function($rootScope){

		//console.log(window.settings);
        //
		//// Get Jquery element
		//var $body = angular.element('body');
        //
		//var stack = window.settings.user.backgroundImages;
        //
		//changeBG();
		//setInterval(changeBG, 10000);
        //
		//function changeBG(){
		//	var current = stack.shift();
		//	$body.css({backgroundImage: 'url("' + window.settings.paths.images + '/' + current + '")'});
		//	stack.push(current);
		//}

	});

