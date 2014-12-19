'use strict';

var controllersModule = angular.module('theboardControllers', []);

// app = angular.module('theboard')
controllersModule.controller("indexController", [
	'$scope', '$http', '$window', 'batchLog',
	function($scope, $http, $window, batchLog){


		$scope.app = {};
		$scope.app.commonLib = {
			identity: 'Common library'
		};

		$scope.app.widgetsToLoad = [

			{
				identity: 'Widget meteo',
				identityHTML: 'widget-meteo',
				url: 'widgets/meteo/widget.html',
				sizeX: 2,
				sizeY: 1,
				row: 0,
				col: 0
			},
			{
				identity: 'Widget clock',
				identityHTML: 'widget-clock',
				url: 'widgets/clock/widget.html',
				backgroundColor: '#202020',
				sizeX: 2,
				sizeY: 1,
				row: 0,
				col: 2
			},
			{
				identity: 'Widget sample',
				identityHTML: 'widget-sample',
				url: 'widgets/sample/widget.html',
				backgroundColor: '#57aae1',
				sizeX: 1,
				sizeY: 1,
				row: 0,
				col: 4
			},
			{
				identity: 'Widget meteo 4',
				identityHTML: 'widget-meteo4',
				url: 'widgets/meteo/widget.html',
				sizeX: 1,
				sizeY: 1,
				row: 0,
				col: 5
			},
			{
				identity: 'Widget meteo 5',
				identityHTML: 'widget-meteo5',
				url: 'widgets/meteo/widget.html',
				sizeX: 2,
				sizeY: 1,
				row: 1,
				col: 0
			},
			{
				identity: 'Widget meteo 2',
				identityHTML: 'widget-meteo2',
				url: 'widgets/meteo/widget.html',
				sizeX: 2,
				sizeY: 2,
				row: 1,
				col: 2
			},
		];
		$scope.gridsterOpts = {
			columns: 6, // the width of the grid, in columns
			//pushing: true, // whether to push other items out of the way on move or resize
			//floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
			//swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
			//width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
			//colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
			//rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
			margins: [20, 20], // the pixel distance between each widget
			//outerMargin: true, // whether margins apply to outer edges of the grid
			//isMobile: false, // stacks the grid items if true
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
				handle: '.my-class', // optional selector for resize handle
				start: function(event, $element, widget) {}, // optional callback fired when drag is started,
				drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
				stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
			}
		};

		$scope.app.widgets = []; // this array will be filled after each widget loaded

		$scope.sendWidgetSignal = function( signal ){
			for( var widgetID in $scope.app.widgets){
				$scope.app.widgets[widgetID].contentWindow.window.location.hash = signal ;
			}
		};

		//console.log($scope);
		// Use a service
		//batchLog('Hello');

		$scope.$on('gridster-resized', function(newSizes){
			console.log(newSizes);
			var newWidth = newSizes[0];
			var newHeight = newSizes[1];
		});

		$scope.$watch('app.widgetsToLoad', function(items){
			// one of the items changed
			console.log('one of the items changed', items);
		}, true);

		/*
		 * Control UI
		 */
		//$scope.toggleMenu = function(){
		//	$mdSidenav('menu').toggle();
		//	$scope.showSimpleToast( 'Menu opened' );
		//}
        //
		//$scope.close = function() {
		//	$mdSidenav('menu').close();
		//	$scope.showSimpleToast( 'Menu closed' );
		//};
        //
		//$scope.showSimpleToast = function( message ) {
		//	$mdToast.show( $mdToast.simple().content(message).position('top right') );
		//};
        //
		//$scope.showMore = function($event) {
		//	$scope.alert = '';
		//	$mdBottomSheet.show({
		//		templateUrl: 'app/partials/more.html',
		//		controller: 'MoreController',
		//		targetEvent: $event
		//	}).then(function(clickedItem) {
		//		$scope.alert = clickedItem.name + ' clicked!';
		//	});
		//};

	}]);

controllersModule.controller('MoreController', function($scope, $mdBottomSheet) {
	$scope.items = [
		{ name: 'Stop widgets', icon: 'hangout' },
		{ name: 'Refresh widgets', icon: 'mail' },
		{ name: 'Start widgets', icon: 'message' },
	];
	$scope.listItemClick = function($index) {
		var clickedItem = $scope.items[$index];
		$mdBottomSheet.hide(clickedItem);
	};
});

controllersModule.controller("errorController", ['$scope', '$http', 'batchLog', function($scope, $http, batchLog){

	$scope.init = function() {

		// Use a service
		batchLog('Hello');

	};

}]);