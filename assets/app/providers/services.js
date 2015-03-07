/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */

angular
    .module('app.services')

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

            error: function(message){
                return this.simpleError(message);
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
    .factory('myHttpInterceptor', function($log, $injector, $q, $window, APP_CONFIG) {
        var $localStorage = $window.localStorage;
        //var modalService = $injector.get('modalService');
        return {
            // optional method
            'request': function(config) {
                
                // Inject token to each requests
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                
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
                
                // Case of token became invalid
                // Request rejected because of no authorized or forbidden
                if(rejection.status === 401 || rejection.status === 403) {

                }

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

    .factory('tokenRefresh', function($interval, $http){
        
        return {
            start: start,
            stop: stop
        }    
        
        var process;
        
        function start(){
            process = $interval(function(){
                $http.get('/auth/token/refresh')
                    .then(function(data){
                        var data = data.data;
                        localStorage.token = data.token;
                    })
                    .catch(function(err){
                        console.error(err);
                    });
            }, 600000); // 1hmn
        }
        
        function stop(){
            clearInterval(process);
        }
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