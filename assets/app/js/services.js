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

    .factory('notifService', ['$rootScope', '$http', 'config', 'toastr', function($rootScope, $http, config, toastr){
        return {
            error: function(message){
                return toastr.error(message);
            },

            success: function(message){
                return toastr.success(message);
            },

            warning: function(message){
                return toastr.warning(message);
            },

            info: function(message){
                return toastr.info(message);
            }
        }
    }])

    .factory('Widget', function($window, $http, config, $log){
        
        var Widget = function(widget){
            this.id = widget.id;
            this.iframeURL = widget.iframeURL;
            
            // @todo remove it and set all attribute in hard
            for(var prop in widget){
                this[prop] = widget[prop];
            }
        }
        
        Widget.prototype.setOptionValue = function(id, value){
            angular.forEach(this.options, function(option){
                if(option.id === id){
                    option.value = value;
                }
            })
        };
        
        /**
         * Take an associative array of options
         * @param options
         */
        Widget.prototype.setOptionsValues = function(options){
            var that = this;
            angular.forEach(options, function(value, id){
                that.setOptionValue(id, value);
            });
        };

        /**
         * WARNING: if you linked the url to an iframe you will occur an iframe reload
         */
        Widget.prototype.rebuildIframeURL = function(){
            // prepare options for widget
            var options = {};
            angular.forEach(this.options, function(option, index){
                options[option.id] = option.value;
            });

            // Prepare finally the widget conf to send to widget
            // It contain only needed information
            var configuration = {
                identity: this.identity,
                identityHTML: this.identityHTML,
                permissions: this.permissions,
                options: options
            };
            this.iframeURL = $window.URI(this.baseURL).search({widget:JSON.stringify(configuration)}).toString();
        };

        Widget.prototype.save = function(){
            return this._save({
                sizeX: this.sizeX,
                sizeY: this.sizeY,
                row: this.row,
                col: this.col,
                options: this.options
            });
        };

        /*
         * Private methods
         */

        Widget.prototype._save = function(data){
            return $http.put(config.routes.widgets.update + '/' + this.id, data)
                .then(function(data) {
                    $log.debug('Widget updated successfully!', data.data);
                    return data.data;
                })
                .catch(function(err) {
                    $log.error('Failure while updating widget', err);
                    throw new Error(config.messages.errors.widgets.unableToUpdate);
                });
        };
        
        return Widget;
        
    })
    
    /**
     * Widget service
     * http://blog.revolunet.com/blog/2014/02/14/angularjs-services-inheritance/
     */
    .factory('widgetService', function($rootScope, $http, $log, config, $window, Widget){

        return {

            //
            _buildBaseWidget: function(widgets){
                var models = [];
                angular.forEach(widgets, function(widget){
                    models.push( new Widget(widget) );
                });
                $log.debug('Widgets built as models successfully!', models);
                return models;
            },

            _update: function(id, data){
                return $http.put(config.routes.widgets.update + '/' + id, data).then(function(data) {
                    $log.debug('Widget updated successfully!', data.data);
                    return data.data;
                })
                    .catch(function(err) {
                        $log.error('Failure while updating widget', err);
                        throw new Error(config.messages.errors.widgets.unableToUpdate);
                    });
            },
            
            get: function(){
                var that = this;
                return $http.get(config.routes.widgets.get)
                    .then(function(data) {
                        $log.debug('Widgets loaded successfully!', data.data);
                        var widgets = data.data;
                        return that._buildBaseWidget(widgets);
                    })
                    .catch(function(error) {
                        $log.error('Failure loading widgets');
                        throw new Error(config.messages.errors.widgets.unableToLoad);
                    });
            },

            update: function( widget ){
                return this._update(widget.id, {
                    sizeX: widget.sizeX,
                    sizeY: widget.sizeY,
                    row: widget.row,
                    col: widget.col
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
            
            reloadWidget: function(widget){
                $rootScope.$broadcast('widget-reload', widget);
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