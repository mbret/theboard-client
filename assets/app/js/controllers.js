'use strict';

angular
	.module('app.controllers', [])

	/**
	 * IndexController
	 *
	 */
	.controller("indexController", [
		'$scope', '$http', '$window', 'settings', 'batchLog', '$log', '$mdSidenav', '$mdSidenav', '$animate', '$mdDialog', 'widgetService',
		function($scope, $http, $window, settings, batchLog, $log, $mdSidenav, $mdToast, $animate, $mdDialog, widgetService){

			//console.log($scope);

			// Get widgets from server
			// Widgets will be relative to an account
			// This is just a list of widgets informations
			widgetService.get()
				.then(function(widgets){
					console.log(widgets);
					$scope.widgets = widgets;
				})
				.catch(function(error){
					// ...
				});


			// Inject to view the gridster configuration
			$scope.gridsterOpts = settings.gridsterOpts;


			/*
			 * Menu left part
			 */
			$scope.refreshWidgets = function(){
				widgetService.sendSignal( null, 'refresh' );
			};
			$scope.stopWidgets = function(){
				widgetService.sendSignal( null, 'stop' );
			};
			$scope.startWidgets = function(){
				widgetService.sendSignal( null, 'start' );
			};
			$scope.closeMenu = function() {
				$mdSidenav('menu').close().then(function(){
					// ...
					return;
				});
			};


			/*
			 * Control UI
			 */
			$scope.toggleMenu = function(){
				$mdSidenav('menu').toggle().then(function(){
					$log.debug("toggle Menu is done");
					//$scope.showSimpleToast( 'Menu opened' );
				});
			};

		}
	])

	/**
	 * Widget controller
	 *
	 * This controller has a specific scope with object 'widget'
	 */
	.controller("WidgetController", ['$scope', '$http', '$mdDialog', '$log', 'widgetService', function($scope, $http, $mdDialog, $log, widgetService){

		var widget = $scope.widget; // We get widget as its a scoped var from html

		//console.log($scope);

		// Display option menu for specific widget
		// The dialog use another controller
		// We pass our sub controller (as the sub controller is defined inside parent he can reach the same var)
		$scope.showOptions = function($event) {
			//console.log(widgetID);
			$mdDialog.show({
				targetEvent: $event,
				parent: angular.element("#" + widget.identityHTML + "-container"),
				templateUrl: 'app/templates/widget_options.tmpl.html',
				controller: dialogController,
				locals: { widget: widget }
			});
		};

		// Controller for dialog box
		// We cannot use the same because the dialog is open in another controller with reduce scope
		// Instead of create new controller alonside others we define here a sub controller
		// We could have used the global var of the parent controller but we prefer doing a complete declaration (widgetService or widget was available from parent)
		var dialogController = [ '$scope', '$mdDialog', 'widgetService', 'widget', function($scope, $mdDialog, widgetService, widget){
			$scope.widget = widget;

			$scope.refresh = function(){
				console.log($scope);
				widgetService.sendSignal( widget, 'refresh' );
			};
			$scope.stop = function(){
				widgetService.sendSignal( widget, 'stop' );
			};
			$scope.start = function(){
				widgetService.sendSignal( widget, 'start' );
			};

			$scope.closeDialog = function() {
				// Easily hides most recent dialog shown...
				// no specific instance reference is needed.
				$mdDialog.hide();
			};
		}];
	}])


	/**
	 * ErrorController
	 *
	 */
	.controller("ErrorController", ['$scope', '$http', 'batchLog', function($scope, $http, batchLog){

		$scope.init = function() {

			// Use a service
			batchLog('Hello');

		};

	}]);