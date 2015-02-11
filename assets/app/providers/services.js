/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */

angular
    .module('app.services')

    /**
     * Account service
     */
    .factory('userService', ['$http', '$injector', 'APP_CONFIG', '$log', '_', function($http, $injector, APP_CONFIG, $log, _){

        return {

            update: function( data ){
                var that = this;
                return $http.put(APP_CONFIG.routes.account.update, data)
                    .then(function(data) {
                        $log.debug('User updated successfully!', data.data);
                        return data.data;
                    })
                    .catch(function(err) {
                        $log.error('Failure while updating user', err);
                        throw new Error(APP_CONFIG.messages.errors.unableToUpdate);
                    });
            }
        }

    }])

    .factory('modalService', ['$rootScope', 'APP_CONFIG', '$injector', function($rootScope, APP_CONFIG, $injector){
        var $modal = $injector.get('$modal');
        return {
            simpleError: function(message){
                return $modal.open({
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

    .factory('notifService', function($rootScope, APP_CONFIG, toastr, $timeout){
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
     * http://blog.revolunet.com/blog/2014/02/14/angularjs-services-inheritance/
     */
    .factory('widgetService', function($rootScope, $http, logger, APP_CONFIG, $window, Widget, dataservice){

        
        
        return {

            /**
             *
             * @param profileID
             * @returns {*}
             */
            getAll: function(profileID){
                var method;
                if( profileID === null || typeof profileID === "undefined"){
                    method = dataservice.getWidgets;
                }
                else{
                    method = dataservice.getWidgetsByProfile;
                }
                return method(profileID).then(function(widgets){
                    return _buildBaseWidget(widgets);
                });
            },
            
            reload: function(widget){
                logger.debug('Widget service reload', widget);
                widget.buildIframeURL();
                $rootScope.$broadcast('widget.reload', widget);
            },
            
            load: function(widget){
                logger.debug('Widget service load', widget);
                widget.buildIframeURL();
                $rootScope.$broadcast('widget.load', widget);
            },

            sendSignal: function( widget, signal ){
                //console.log(widget);
                if(widget) logger.debug('Signal ' + signal + ' sent to widget ' + widget.identity);
                else logger.debug('widgetService: Signal ' + signal + ' sent to all widgets');
                $rootScope.$broadcast('widget-signal', widget, signal, JSON.stringify({signal:signal}));
                return;
            },

            reloadAll: function( widgets ){
                logger.debug('Widget service reload all');
                angular.forEach(widgets, function(widget){
                    widget.buildIframeURL();
                });
                $rootScope.$broadcast('widget.reloadAll', widgets);
            }

        }

        //
        function _buildBaseWidget(widgets){
            var models = [];
            angular.forEach(widgets, function(widget){
                models.push( new Widget(widget) );
            });
            //logger.debug('Widgets built as models successfully!', models);
            return models;
        }
    })
    
    .factory('profilesService', function(dataservice){
        return {
            update: update,
            getAll: getAll,
            get: get
        }
        
        function getAll(){
            return dataservice.getProfiles();
        }
        
        function update(profile){
            return dataservice.updateProfile(profile);
        }
        
        function get(id){
            return dataservice.getProfile(id);
        }
        
    })

    /**
     * Good doc to read http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
     **/
    .factory('myHttpInterceptor', function($log, $injector, $q) {
        //var modalService = $injector.get('modalService');
        return {
            // optional method
            'request': function(APP_CONFIG) {
                //$log.debug('A request has been made');
                // do something on success
                return APP_CONFIG;
            },

            // optional method
            //'requestError': function(rejection) {
            //    // do something on error
            //    if (canRecover(rejection)) {
            //        return responseOrNewPromise
            //    }
            //    return $q.reject(rejection);
            //},

            response: function(response) {
                //if (response.config.nointercept) {
                    return $q.when(response); // let it pass
                //} else {
                //    var defer = $q.defer();
                //    $injector.invoke(function($http) {
                //        This modification prevents interception:
                        //response.config.nointercept = true;
                        //Reuse modified config and send the same request again:
                        //$http(response.config)
                        //    .then(function(resp) {
                        //        defer.resolve(resp);
                        //    },
                        //    function(resp) {
                        //        defer.reject(resp);
                        //    });
                    //});
                    //return defer.promise;
                //}
            },

            /**
             * On response error try to send again the request
             * If error again then display error.
             * 
             * Do not display modal here because if modal crash because of unavailable template it will loop
             * @param rejection
             * @returns {Promise}
             */
            responseError: function(rejection) {
                console.log(rejection);

                // We can define here if we handle or not depending of the request
                var shouldHandle = (rejection && rejection.config && rejection.config.headers);

                if (shouldHandle){
                    //var defer = $q.defer();
                    $injector.invoke(function() {
                        //defer.reject(resp);
                    });
                    //return defer.promise;
                }
                //else{
                    return $q.reject(rejection);
                //}
            }
        };
    })

    .factory('geolocationService', ['$q','$rootScope','$window','APP_CONFIG',function ($q,$rootScope,$window,APP_CONFIG) {
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
                                    deferred.reject(APP_CONFIG.messages.errors.geolocation.permissionDenied);
                                //});
                                break;
                            case 2:
                                //$rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                                //$rootScope.$apply(function() {
                                    deferred.reject(APP_CONFIG.messages.errors.geolocation.positionUnavailable);
                                //});
                                break;
                            case 3:
                                //$rootScope.$broadcast('error',geolocation_msgs.errors.geolocation.timeout);
                                //$rootScope.$apply(function() {
                                    deferred.reject(APP_CONFIG.messages.errors.geolocation.timeout);
                                //});
                                break;
                        }
                    }, opts);
                }
                else
                {
                    //$rootScope.$broadcast('error',messages.errors.geolocation.unsupportedBrowser);
                    //$rootScope.$apply(function(){deferred.reject(messages.errors.geolocation.unsupportedBrowser);});
                    deferred.reject(APP_CONFIG.messages.errors.geolocation.unsupportedBrowser);
                }
                return deferred.promise;
            }
        };
    }]);