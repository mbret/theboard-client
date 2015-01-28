'use strict';

angular
	.module('app.controllers', [])

	/**
	 * USE THIS CONTROLLER AS LESS AS POSSIBLE (bad practice)
	 * Usually if you need something to go here you should probably make a directive or service !
	 */
	.controller("MainController", [
		'$scope', '$http', '$window', '$q', 'config', '$log', /*'$mdToast', */'$animate', /*'$mdDialog', */'widgetService', 'geolocationService',
		function($scope, $http, $window, $q, config, $log,/* $mdToast,*/ $animate, /*$mdDialog,*/ widgetService, geolocationService){

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
	.controller("IndexController", function($rootScope, $scope, $http, $window, $q, config, $log, $animate, widgetService, geolocationService, modalService, notifService, $timeout, sidebarService){

			// This var will contain all widget element
			// These widgets will be placed inside iframe and get from server
			$scope.widgets = null;
			$scope.lockWidgets = false;
			
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
			$scope.lockOrUnlock = function(){
				$scope.lockWidgets = !$scope.lockWidgets;
				if($scope.lockWidgets){
				}
				else{
				}
			}
			
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
					promises.push(deferred.promise);

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
						permissions.email = config.user.email;
					}
					// location (async)
					// We create a new promise (with anonymous function)
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
									deferred2.reject(err);
								});
						}
						else{
							deferred2.resolve();
						}
						return deferred2.promise;
					})()
					.then(function(){
						//console.log(widget);
						widget.permissions = permissions;
						// Fill URL of iframe
						widget.iframeURL = $window.URI(widget.baseURL).search({widget:JSON.stringify(widget)}).toString();
						// Get user pref for specific style for widget
						widget.borders = config.user.config.widgetsBorders;
					})
					.catch(function(err){
						return deferred.reject(err);
					})
					.finally(function(){
						return deferred.resolve();
					});
				});

				// Run loop job
				// catch is handle by superior promise
				return $q.all(promises).then(function(){
					$timeout(function(){
						$scope.widgets = widgets;
					});
					widgetsPreviousState = angular.copy(widgets);
				});

			})
			.catch(function(error){
				// This catch handle error from all subsequent code
				// If error happens when set permission or promises loop for example
				modalService.simpleError(error.message);
			});

			/*
			 * Gridster part
			 *
			 *
			 */
			// Inject to view the gridster configuration
			$scope.gridsterOpts = config.gridsterOpts;


			// Set event function when widgets are dragged
			$scope.gridsterOpts.draggable = {
				start: function(event, $element, widget){
					$rootScope.$broadcast('backstretch-pause');
				},
				stop: function(event, $element, widget) {
					$rootScope.$broadcast('backstretch-resume');
					return widgetService.updateWidgetIfChanged( widget, widgetsPreviousState, notifService);
				}
			};
			
			// Set event function when widgets are resized
			$scope.gridsterOpts.resizable = {
				start: function(event, $element, widget){
					$rootScope.$broadcast('backstretch-pause');
				},
				/**
				 * When a widget has been resized
				 *
				 */
				stop: function(event, $element, widget) {
					$rootScope.$broadcast('backstretch-resume');
					return widgetService.updateWidgetIfChanged( widget, widgetsPreviousState, notifService);
				}
			};
			
			// When the window change and gridster has been resized in order to be displayed
			$scope.$on('gridster-resized', function(event, size){

			});
			// Watch item changes
			// @todo this event is triggered at startup, I suspect its due to the page building which make gridster change during process
			// @todo maybe use a queue here to store change and call server less times
			$scope.$watch('widgets', function(newWidgets){

				
			}, true);
		}
	)

	/**
	 * form validation: http://www.ng-newsletter.com/posts/validations.html
	 *
	 */
	.controller("SettingsController", ['$scope', '$http', '$log', 'accountService', 'modalService', 'config', 'notifService', function($scope, $http, $log, accountService, modalService, config, notifService){

		// Set scope for widgets settings
		$scope.widgets = {
			borders: config.user.config.widgetsBorders
		};
		
		/*===========================
		 * Get user data from server
		 * - init scope used by form
		 *===========================*/
		//accountService.get( config.user.id ).then(function(account){
		//	$scope.account = account;
		//}).catch(function(err){
		//	modalService.simpleError(err.message);
		//	// @todo get a return of dialog and put application on error
		//});

		/*===========================
		 * Form submit (profile)
		 *===========================*/
		//$scope.submitted = false;
		$scope.updateAccountFormSubmit = function(){
			if($scope.updateAccountForm.$valid){
				// Update
				accountService.update({
					firstName: $scope.account.firstName,
					lastName: $scope.account.lastName
				}).then(function(){
					notifService.success( config.messages.success.form.updated )
				}).catch(function(err){
					modalService.simpleError(err.message);
				});
			}
			else{
				notifService.error( config.messages.errors.form.invalid );
			}
		}

		/*===========================
		 * Form submit (widgets)
		 *===========================*/
		//$scope.submitted = false;
		$scope.updateWidgetsSettingsFormSubmit = function(){
			if($scope.updateWidgetsSettingsForm.$valid){
				// Update
				accountService.updateSettings({
					widgetsBorders: $scope.widgets.borders
				}, true /*refreshUser*/ ).then(function(){
					notifService.success( config.messages.success.form.updated )
				}).catch(function(err){
					modalService.simpleError(err.message);
				});
			}
			else{
				notifService.error( config.messages.errors.form.invalid );
			}
		}

	}])

	.controller("ProfileController", ['$scope', '$http', '$log', 'accountService', 'modalService', 'config', 'notifService',
		function($scope, $http, $log, accountService, modalService, config, notifService){

			$scope.user = {
				avatar: config.user.avatar,
				banner: config.user.banner,
				job: 'Developer',
				address: 'Nancy, France',
				phone: '(+33) 6 06 65 87 55',
				email: config.user.email,
				firstName: config.user.firstName,
				lastName: config.user.lastName,
				displayName: config.user.firstName ? config.user.firstName : config.user.email
			};

		}
	])

	.controller("SidebarController", ['$scope', '$log', 'widgetService', 'config', 'sidebarService', function($scope, $log, widgetService, config, sidebarService){

		$scope.close = function(){
			sidebarService.close();
		}
		
		$scope.user = {
			avatar: config.user.avatar,
			email: config.user.email,
			firstName: config.user.firstName,
			lastName: config.user.lastName,
			displayName: config.user.firstName ? config.user.firstName : config.user.email
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

	