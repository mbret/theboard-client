'use strict';

angular
	.module('app.controllers', [])

	/**
	 * IndexController
	 *
	 * IMPORTANT !!!!
	 * Controllers should never do DOM manipulation or hold DOM selectors; that's where directives and using ng-model come in. Likewise business logic should live in services, not controllers.
	 * Data should also be stored in services, except where it is being bound to the $scope
	 */
	.controller("indexController", [
		'$scope', '$http', '$window', 'settings', '$log', '$mdSidenav', '$mdToast', '$animate', '$mdDialog', 'widgetService', 'geolocationService',
		function($scope, $http, $window, settings, $log, $mdSidenav, $mdToast, $animate, $mdDialog, widgetService, geolocationService){

			$scope.bodyStyle = {
				'background': 'url(../img/board_bg.jpg) no-repeat center center fixed'
			}

			//console.log($scope);
			$scope.widgets = null;
			var widgetsPreviousState = null;

			/*
			 * Widget part
			 *
			 *
			 */
			// Get widgets from server
			// Widgets will be relative to an account
			// This is just a list of widgets informations
			widgetService.get().then(function(widgets){

					// Loop over all widget and set required values
					angular.forEach(widgets, function(widget){

						// Check for permissions
						var permissionsWithValues = {};

						if( widget.permissions &&  widget.permissions.indexOf('mail') !== -1  ) permissionsWithValues.mail = 'user@user.com';
						// async
						if( widget.permissions &&  widget.permissions.indexOf('location') !== -1 ){
							geolocationService.getLocation()
								.then(function(data){
									permissionsWithValues.location = data.coords;
									next();
								})
								.catch(function(err){
									permissionsWithValues.location = null;
									$mdToast.show($mdToast.simple().content(err).position('top right'));
									next();
								});
						}
						else{
							next();
						}

						function next(){
							widget.permissions = permissionsWithValues;

							// Init the iframe url
							widget.iframeURL = $window.URI(widget.baseURL).search({test: "sqd + ",widget:JSON.stringify(widget)}).toString();
						}

					});

					$scope.widgets = widgets;
					widgetsPreviousState = angular.copy(widgets);
				})
				.catch(function(error){
					// ...
				});



			/*
			 * Gridster part
			 *
			 *
			 */
			// Inject to view the gridster configuration
			$scope.gridsterOpts = settings.gridsterOpts;

			// When the window change and gridster has been resized in order to be displayed
			$scope.$on('gridster-resized', function(size){

			});
			// Watch item changes
			// @todo this event is triggered at startup, I suspect its due to the page building which make gridster change during process
			// @todo maybe use a queue here to store change and call server less times
			$scope.$watch('widgets', function(newWidgets){

				//$log.warn('salut', widgetsPreviousState, newWidgets);
				// Update widgets on server (only when widgets has been loaded first time)
				if( widgetsPreviousState != null && ! angular.equals(widgetsPreviousState, newWidgets )){

					//$log.warn('salut', widgetsPreviousState, newWidgets);
					//return widgetService.update( newWidgets )
					//	.then(function(){
					//		$mdToast.show($mdToast.simple().content( settings.messages.widgets.updated ).position('top right'));
					//	})
					//	.catch(function(err){
					//		// ...
					//		$mdToast.show($mdToast.simple().content(err.message).position('top right'));
					//	});
				}
				else{
					// widgets are not different so don't make useless call
					return;
				}
			}, true);
			$scope.gridsterOpts.draggable = {
				/**
				 * When a widget has been dragged
				 *
				 */
				stop: function(event, $element, widget) {
					return updateWidgetIfNecessary( widget, widgetsPreviousState);
				}
			};
			$scope.gridsterOpts.resizable = {
				/**
				 * When a widget has been resized
				 *
				 */
				stop: function(event, $element, widget) {
					return updateWidgetIfNecessary( widget, widgetsPreviousState);
				}
			};

			/**
			 * Function that handle the widget update on action
			 * - Get the new widget
			 * - Compare this widget to all other widgets
			 * - Check the equality between this widget and the list of previous widget
			 * 	if one eq found 	=> this widget has not been dragged or resized (the old is equal to the new)
			 *	if no eq found 		=> this widget is new so update it
			 *
			 * - When success we also update the widget in previous state etc
			 */
			function updateWidgetIfNecessary(widgetToUpdate, widgetsPreviousState){
				// loop over all widget, if there are one equality, it means that the widget is still at the same place
				var widgetHasNewPlace = true;
				var key = null;
				angular.forEach(widgetsPreviousState, function(obj, objKey){

					if(obj.id == widgetToUpdate.id){
						key = objKey; // keep reference to update previous widgets
						if(angular.equals(obj, widgetToUpdate )){
							widgetHasNewPlace = false;
						}
					}

				});
				// If there are different then update widget
				if( widgetHasNewPlace ){
					return widgetService.update( widgetToUpdate )
						.then(function( widgetUpdated ){
							$mdToast.show($mdToast.simple().content( settings.messages.widgets.updated ).position('top right'));
							widgetsPreviousState[key] = angular.copy(widgetToUpdate);
						})
						.catch(function(err){
							// ...
							$mdToast.show($mdToast.simple().content(err.message).position('top right'));
						});
				}
			}

			/*
			 * Sidebar part
			 *
			 *
			 */
			$scope.toggleMenu = function(){
				$mdSidenav('sidebar').toggle().then(function(){
					$log.debug("toggle Menu is done");
					//$scope.showSimpleToast( 'Menu opened' );
				});
			};

		}
	])

	.controller("SidebarController", ['$scope', '$mdSidenav', '$log', 'widgetService', function($scope, $mdSidenav, $log, widgetService){
		$scope.close = function(){
			$mdSidenav('sidebar').close()
				.then(function(){

				});
		}
		$scope.refreshWidgets = function(){
			widgetService.sendSignal( null, 'refresh' );
		};
		$scope.stopWidgets = function(){
			widgetService.sendSignal( null, 'stop' );
		};
		$scope.startWidgets = function(){
			widgetService.sendSignal( null, 'start' );
		};

		$scope.changeBackground = function($event){
			$mdDialog.show({
				targetEvent: $event,
				//parent: angular.element("#" + widget.identityHTML + "-container"),
				templateUrl: 'app/templates/widget_options.tmpl.html',
				controller: changeBackgroundController,
				//locals: { widget: widget }
			});
		}


		var changeBackgroundController = [ '$scope', '$mdDialog', 'widgetService', 'widget', function($scope, $mdDialog, widgetService, widget){

			// ...

			$scope.closeDialog = function() {
				// Easily hides most recent dialog shown...
				// no specific instance reference is needed.
				$mdDialog.hide();
			};
		}];

	}])

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
				//parent: angular.element("#" + widget.identityHTML + "-container"),
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