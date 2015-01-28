/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */

angular
    .module('app.services', [])

    /**
     * This is BAAAAAAAAAAAAAD practices
     * @todo animate 
     * @todo don't use jquery 
     */
    .factory('sidebarService', ['$log', function($log){
        return {
            close: function(){
                $('.sidebar').removeClass('sidebar-open');
                $('.sidebar').addClass('sidebar-closed');
                $('.sidebar-backdrop').removeClass('active');
            },
            open: function(){
                $('.sidebar').removeClass('sidebar-closed');
                $('.sidebar').addClass('sidebar-open');
                $('.sidebar-backdrop').addClass('active');
            },
            toggle: function(){
                var self = this;
                if ($('.sidebar').hasClass('sidebar-closed')) {
                    self.open();
                }
                else{
                    self.close();
                }
            },
            // Put the sidebar in static state (disable backdrop but let open the sidebar)
            putStatic: function(){
                var self = this;
                self.open();
                $('.sidebar-backdrop').removeClass('active');
            }
        }
    }])
    
    .factory('batchLog', ['$interval', '$log', function($interval, $log) {
        var messageQueue = [];

        function log() {
          if (messageQueue.length) {
          $log.log('batchLog messages: ', messageQueue);
          messageQueue = [];
        }
      }

      // start periodic checking
      $interval(log, 1000);

      return function(message) {
        messageQueue.push(message);
      }
    }])

    /**
     * Account service
     */
    .factory('accountService', ['$http', 'config', '$log', function($http, config, $log){

        return {
            
            refreshUser: function(){
                return $http.get(config.routes.account.get)
                        .then(function(data) {
                            config.user = data.data;
                            $log.debug('User refreshed successfully!', data.data);
                            return data.data;
                        })
                        .catch(function(error) {
                            $log.error('Failure refreshing user', error);
                            throw Error(config.messages.errors.unableToLoad);
                        });
            },
            
            update: function( data, refreshUser ){
                var that = this;
                return $http.put(config.routes.account.update, data)
                    .then(function(data) {
                        $log.debug('Account updated successfully!', data.data);
                        if(refreshUser === true){
                            return that.refreshUser();
                        }
                        return data.data;
                    })
                    .catch(function(err) {
                        $log.error('Failure while updating account', err);
                        throw new Error(config.messages.errors.unableToUpdate);
                    });
            },

            //get: function( id ){
            //    return $http.get(config.routes.account.get)
            //        .then(function(data) {
            //            $log.debug('Account loaded successfully!', data.data);
            //            return data.data;
            //        })
            //        .catch(function(error) {
            //            $log.error('Failure loading account', error);
            //            throw Error(config.messages.errors.unableToLoad);
            //        });
            //},
            
            updateSettings: function( settings, refreshUser ){
                return this.update({
                    settings: settings
                }, refreshUser);
                
            }
        }

    }])

    .factory('modalService', ['$rootScope', '$http', 'config', '$modal', function($rootScope, $http, config, $modal){
        return {
            simpleError: function(message){
                $modal.open({
                    templateUrl: '/app/templates/modals/error.html',
                    windowClass: 'modal-danger',
                    size: 'sm',
                    controller: modalController,
                    resolve: { message: function(){ return message; } }
                });
                function modalController($scope, $modalInstance, message) {
                    $scope.message = message;
                    $scope.ok = function () {
                        $modalInstance.close();
                    };
                };
            },

            success: function(message){
                return $mdDialog.show($mdDialog.alert()
                    .title('Success')
                    .ok('Ok')
                    .content(message));
            },

            successDialog: function(message){
                return this.success(message);
            },

            successToast: function(message){
                return $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position('top right')
                        //.hideDelay(0)
                );
            }
        }
    }])

    .factory('notifService', function($rootScope, $http, config, toastr, $timeout){
        return {
            
            display: function(label, message){
                $timeout(function(){
                    if(message instanceof Array){
                        angular.forEach(message, function(entry){
                            toastr[label](entry);
                        })
                    }
                    else{
                        toastr[label](message);
                    }
                });

            },
            
            error: function(message){
                return this.display('error', message);
            },

            success: function(message){
                return this.display('success', message);
            },

            warning: function(message){
                return this.display('warning', message);
            },

            info: function(message){
                return this.display('info', message);
            }
        }
    })

    /**
     * Widget service
     *
     */
    .factory('widgetService', ['$rootScope', '$http', '$log', 'config', function($rootScope, $http, $log, config){

        return {
            get: function(){
                return $http.get(config.routes.widgets.get)
                    .then(function(data) {
                        $log.debug('Widgets loaded successfully!', data.data);
                        return data.data;
                    })
                    .catch(function(error) {
                        $log.error('Failure loading widgets');
                        throw new Error(config.messages.errors.widgets.unableToLoad);
                    });
            },

            update: function( widget ){
                return $http.put(config.routes.widgets.update, {widget: widget})
                    .then(function(data) {
                        $log.debug('Widget updated successfully!', data.data);
                        return data.data;
                    })
                    .catch(function(err) {
                        $log.error('Failure while updating widget', err);
                        throw new Error(config.messages.errors.widgets.unableToUpdate);
                    });
            },

            sendSignal: function( widget, signal ){
                //console.log(widget);
                if(widget) $log.debug('Signal ' + signal + ' sent to widget ' + widget.identity);
                else $log.debug('widgetService: Signal ' + signal + ' sent to all widgets');
                $rootScope.$broadcast('widget-signal', widget, signal, JSON.stringify({signal:signal}));
                return;
            },
            
            reloadAll: function(){
                $rootScope.$broadcast('widget-reload');
                return;
            },

            /**
             * Check if two widget have the same position.
             * Check row, col, size etc
             * @param widget
             * @param widgetToCompare
             * @returns {boolean}
             */
            hasSamePosition: function( widget, widgetToCompare){
                return (widget.col === widgetToCompare.col
                && widget.row === widgetToCompare.row
                && widget.sizeX === widgetToCompare.sizeX
                && widget.sizeY === widgetToCompare.sizeY);
            },

            /**
             * Function that handle the widget update on action
             * - Get the new widget
             * - Compare this widget to all other widgets
             * - Check the equality between this widget and the list of previous widget
             * 	if one eq found 	=> this widget has not been dragged or resized (the old is equal to the new)
             *	if no eq found 		=> this widget is new so update it
             *
             * - When success we also update the widget in previous state etc
             * @todo remove use of notifService and return a promise (always)
             */
            updateWidgetIfChanged: function(widgetToUpdate, widgetsPreviousState, notifService){
                var that = this;
                // loop over all widget, if there are one equality, it means that the widget is still at the same place
                var widgetHasNewPlace = true;
                var key = null;
                angular.forEach(widgetsPreviousState, function(obj, objKey){
    
                    if(obj.id == widgetToUpdate.id){
                        key = objKey; // keep reference to update previous widgets
                        //$log.debug(obj, widgetToUpdate);
                        if( that.hasSamePosition(obj, widgetToUpdate) ){
                            widgetHasNewPlace = false;
                        }
                    }
    
                });
                // If there are different then update widget
                if( widgetHasNewPlace ){
                    $log.debug('sdfsdf');
                    return that.update( widgetToUpdate )
                        .then(function( widgetUpdated ){
                            notifService.success( config.messages.widgets.updated );
                            widgetsPreviousState[key] = angular.copy(widgetToUpdate);
                        })
                        .catch(function(err){
                            notifService.error( err.message );
                        });
                }
                return false;
            }
        }

    }])

    /**
     * Good doc to read http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
     * */
    .factory('myHttpInterceptor', function($log) {
        return {
            // optional method
            'request': function(config) {
                $log.debug('A request has been made');
                // do something on success
                return config;
            },

            // optional method
            //'requestError': function(rejection) {
            //    // do something on error
            //    if (canRecover(rejection)) {
            //        return responseOrNewPromise
            //    }
            //    return $q.reject(rejection);
            //},

            // optional method
            'response': function(response) {
                // do something on success
                return response;
            }

            // optional method
            //'responseError': function(rejection) {
            //    // do something on error
            //    if (canRecover(rejection)) {
            //        return responseOrNewPromise
            //    }
            //    return $q.reject(rejection);
            //}
        };
    })

    .factory('geolocationService', ['$q','$rootScope','$window','config',function ($q,$rootScope,$window,config) {
        return {
            getLocation: function (opts) {

                var deferred = $q.defer();

                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(function(position){
                        $rootScope.$apply(function(){
                            deferred.resolve(position);
                        });
                    }, function(error) {
                        switch (error.code) {
                            case 1:
                                //$rootScope.$broadcast('error',geolocation_msgs['errors.location.permissionDenied']);
                                //$rootScope.$apply(function() {
                                    deferred.reject(config.messages.errors.geolocation.permissionDenied);
                                //});
                                break;
                            case 2:
                                //$rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                                //$rootScope.$apply(function() {
                                    deferred.reject(config.messages.errors.geolocation.positionUnavailable);
                                //});
                                break;
                            case 3:
                                //$rootScope.$broadcast('error',geolocation_msgs.errors.geolocation.timeout);
                                //$rootScope.$apply(function() {
                                    deferred.reject(config.messages.errors.geolocation.timeout);
                                //});
                                break;
                        }
                    }, opts);
                }
                else
                {
                    //$rootScope.$broadcast('error',messages.errors.geolocation.unsupportedBrowser);
                    //$rootScope.$apply(function(){deferred.reject(messages.errors.geolocation.unsupportedBrowser);});
                    deferred.reject(config.messages.errors.geolocation.unsupportedBrowser);
                }
                return deferred.promise;
            }
        };
    }]);