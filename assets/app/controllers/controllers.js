'use strict';

angular
	.module('app.controllers')

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

	