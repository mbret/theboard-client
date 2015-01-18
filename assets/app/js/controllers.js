'use strict';

angular
	.module('app.controllers', [])

	/**
	 * USE THIS CONTROLLER AS LESS AS POSSIBLE (bad practice)
	 * Usually if you need something to go here you should probably make a directive or service !
	 */
	.controller("MainController", [
		'$scope', '$http', '$window', '$q', 'settings', '$log', /*'$mdToast', */'$animate', /*'$mdDialog', */'widgetService', 'geolocationService',
		function($scope, $http, $window, $q, settings, $log,/* $mdToast,*/ $animate, /*$mdDialog,*/ widgetService, geolocationService){

			/**
			 * Lib used: https://github.com/TalAter/annyang
			 * Google test speech recognition: http://www.google.com/intl/fr/chrome/demos/speech.html
			 *
			 * On http site the authorization will pop every time, not on https
			 */
			var commands = {
				'Widgets* refresh': function() {
					alert('Widgets are refreshing');
				},
				'Widgets* stop': function() {
					alert('Widgets are stopped!');
				}
			};

			//annyang.debug();
			//annyang.addCommands(commands);
			//annyang.start();


		}
	])

	/**
	 * IndexController
	 *
	 * IMPORTANT !!!!
	 * Controllers should never do DOM manipulation or hold DOM selectors; that's where directives and using ng-model come in. Likewise business logic should live in services, not controllers.
	 * Data should also be stored in services, except where it is being bound to the $scope
	 */
	.controller("IndexController", [
		'$scope', '$http', '$window', '$q', 'settings', '$log', '$animate', 'widgetService', 'geolocationService', 'modalService', 'notifService', '$timeout', 'sidebarService',
		function($scope, $http, $window, $q, settings, $log, $animate, widgetService, geolocationService, modalService, notifService, $timeout, sidebarService){

			// This var will contain all widget element
			// These widgets will be placed inside iframe and get from server
			$scope.widgets = null;

			// This var save the previous widget state.
			// If widgets are moved then this var contain all widgets before this move
			var widgetsPreviousState = null;

			// Function for menu button
			$scope.toggleMenu = function () {
				sidebarService.toggle();
			}

			$scope.refreshWidgets = function(){
				widgetService.sendSignal( null, 'refresh' );
			};
			$scope.stopWidgets = function(){
				widgetService.sendSignal( null /*widget*/, 'stop' /*signal*/);
				return false;
			};
			$scope.startWidgets = function(){
				widgetService.sendSignal( null, 'start' );
			};
			$scope.reloadWidgets = function(){
				widgetService.reloadAll();
			};
			
			/*
			 * Widget load and init
			 *
			 * - Get widgets from server
			 * - Transform the permissions array into filled object
			 *
			 */
			widgetService.get().then(function(widgets){

				// Loop over all widget and set required values
				// some tasks may be async so we prepare promise loop
				var promises = [];
				angular.forEach(widgets, function(widget){
					
					// create promise and push it to run job later
					var deferred = $q.defer();
					promises.push(deferred);

					// =============================
					// Fill permissions part
					// permissions: ['email', 'location']
					// =============================
					var permissions = {
						email: null,
						location: null
					};

					// mail
					if( widget.permissions &&  widget.permissions.indexOf('email') !== -1  ){
						permissions.email = settings.user.email;
					}
					// location (async)
					(function(){
						console.log(widget);
						var deferred2 = $q.defer();
						if( widget.permissions &&  widget.permissions.indexOf('location') !== -1 ){
							// get location using geoloc browser api
							geolocationService.getLocation()
								.then(function(data){
									permissions.location = data.coords;
									deferred2.resolve();
								})
								.catch(function(err){
									$log.debug('User has not accepted location, permission is set to null');
									modalService.simpleError(err.message);
									deferred2.reject(err);
								});
						}
						else{
							deferred2.resolve();
						}
						return deferred2.promise;
					})()
					.then(function(){
						console.log(widget);
						widget.permissions = permissions;
							
						// =============================
						// Fill URL of iframe
						// =============================
						widget.iframeURL = $window.URI(widget.baseURL).search({widget:JSON.stringify(widget)}).toString();
						return;
					})
					.catch(function(err){
						// nothing
					})
					.finally(function(){
						
						// Init the iframe url
						return deferred.resolve();
					});
					// nothing should happens here
				});

				// Run loop job
				$q.all(promises).then(function(){
					$timeout(function(){
						$scope.widgets = widgets;
					});
					widgetsPreviousState = angular.copy(widgets);
				});

			})
			.catch(function(error){
				modalService.simpleError(error.message);
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
						$log.debug(obj, widgetToUpdate);
						if( widgetService.hasSamePosition(obj, widgetToUpdate) ){
							widgetHasNewPlace = false;
						}
					}

				});
				// If there are different then update widget
				if( widgetHasNewPlace ){
					return widgetService.update( widgetToUpdate )
						.then(function( widgetUpdated ){
							notifService.success( settings.messages.widgets.updated );
							widgetsPreviousState[key] = angular.copy(widgetToUpdate);
						})
						.catch(function(err){
							notifService.error( err.message );
						});
				}
			}

		}
	])

	/**
	 * form validation: http://www.ng-newsletter.com/posts/validations.html
	 */
	.controller("SettingsController", ['$scope', '$http', '$log', 'accountService', 'modalService', 'settings', 'notifService', function($scope, $http, $log, accountService, modalService, settings, notifService){

		/*===========================
		 * Get user data from server
		 * - init scope used by form
		 *===========================*/
		accountService.get( settings.user.id ).then(function(account){
			$scope.account = account;
		}).catch(function(err){
			modalService.simpleError(err.message);
			// @todo get a return of dialog and put application on error
		});

		/*===========================
		 * Form submit
		 *===========================*/
		$scope.submitted = false;
		$scope.updateAccountFormSubmit = function(){
			if($scope.updateAccountForm.$valid){
				// Update
				accountService.update(settings.user.id, {
					firstName: $scope.account.firstName,
					lastName: $scope.account.lastName
				}).then(function(){
					notifService.success( settings.messages.account.updated )
				}).catch(function(err){
					modalService.simpleError(err.message);
				});
			}
			else{
				notifService.error( settings.messages.errors.form.invalid );
			}
		}

	}])

	.controller("ProfileController", ['$scope', '$http', '$log', 'accountService', 'modalService', 'settings', 'notifService',
		function($scope, $http, $log, accountService, modalService, settings, notifService){

			$scope.user = {
				avatar: settings.user.avatar,
				job: 'Developer',
				address: 'Nancy, France',
				phone: '(+33) 6 06 65 87 55',
				email: settings.user.email,
				firstName: settings.user.firstName,
				lastName: settings.user.lastName,
				displayName: settings.user.firstName ? settings.user.firstName : settings.user.email
			};

		}
	])

	.controller("SidebarController", ['$scope', '$log', 'widgetService', 'settings', 'sidebarService', function($scope, $log, widgetService, settings, sidebarService){

		$scope.close = function(){
			sidebarService.close();
		}
		
		$scope.user = {
			avatar: settings.user.avatar,
			email: settings.user.email,
			firstName: settings.user.firstName,
			lastName: settings.user.lastName,
			displayName: settings.user.firstName ? settings.user.firstName : settings.user.email
		};


		//$scope.refreshWidgets = function(){
		//	widgetService.sendSignal( null, 'refresh' );
		//};
		//$scope.stopWidgets = function(){
		//	widgetService.sendSignal( null, 'stop' );
		//};
		//$scope.startWidgets = function(){
		//	widgetService.sendSignal( null, 'start' );
		//};

		//$scope.changeBackground = function($event){
			//$mdDialog.show({
			//	targetEvent: $event,
			//	//parent: angular.element("#" + widget.identityHTML + "-container"),
			//	templateUrl: 'app/templates/widget_options.tmpl.html',
			//	controller: changeBackgroundController,
			//	//locals: { widget: widget }
			//});
		//}


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
	//.controller("WidgetController", ['$scope', '$http', '$log', 'widgetService', function($scope, $http, $log, widgetService){
    //
	//	var widget = $scope.widget; // We get widget as its a scoped var from html
    //
	//	//console.log($scope);
    //
	//	// Display option menu for specific widget
	//	// The dialog use another controller
	//	// We pass our sub controller (as the sub controller is defined inside parent he can reach the same var)
	//	$scope.showOptions = function($event) {
	//		//console.log(widgetID);
	//		//$mdDialog.show({
	//		//	targetEvent: $event,
	//		//	//parent: angular.element("#" + widget.identityHTML + "-container"),
	//		//	templateUrl: 'app/templates/widget_options.tmpl.html',
	//		//	controller: dialogController,
	//		//	locals: { widget: widget }
	//		//});
	//	};
    //
	//	// Controller for dialog box
	//	// We cannot use the same because the dialog is open in another controller with reduce scope
	//	// Instead of create new controller alonside others we define here a sub controller
	//	// We could have used the global var of the parent controller but we prefer doing a complete declaration (widgetService or widget was available from parent)
	//	var dialogController = [ '$scope', '$mdDialog', 'widgetService', 'widget', function($scope, $mdDialog, widgetService, widget){
	//		$scope.widget = widget;
    //
	//		$scope.refresh = function(){
	//			widgetService.sendSignal( widget, 'refresh' );
	//		};
	//		$scope.stop = function(){
	//			widgetService.sendSignal( widget, 'stop' );
	//		};
	//		$scope.start = function(){
	//			widgetService.sendSignal( widget, 'start' );
	//		};
    //
	//		$scope.closeDialog = function() {
	//			// Easily hides most recent dialog shown...
	//			// no specific instance reference is needed.
	//			//$mdDialog.hide();
	//		};
	//	}];
	//}])

	