/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */

angular
    .module('app.services')

    .factory('modalService', ['$rootScope', 'APP_CONFIG', '$injector', 'logger', function($rootScope, APP_CONFIG, $injector, logger){

        var $modal = $injector.get('$modal');
        return {

            simpleError: function(message){

                logger.error(message);

                if(typeof(message) === 'object'){
                    message = message.message;
                }

                return $modal.open({
                    templateUrl: '/app/views/templates/modals/error.html',
                    windowClass: 'modal-danger',
                    size: 'sm',
                    resolve: { message: function(){ return message; } },

                    controller: function($scope, $modalInstance, message) {
                        $scope.message = message;
                        $scope.ok = function () {
                            $modalInstance.close();
                        };
                    },
                });
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

    .factory('notifService', function($rootScope, APP_CONFIG, toastr, $timeout, $http, $log){
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
            },

            /**
             * Will try to get eventual flash message from server.
             * They are not sent automatically to app for now.
             */
            watchForServerFlashMessage: function(){
                var self = this;
                // Check for flash message from server
                // These message can come from login/logout/etc
                // We display it after Pace is hidden.
                $http.get(APP_CONFIG.routes.flash).then(function(data){
                    $log.debug(data.data);
                    var messages = data.data;

                    if(messages.errors){
                        self.error(messages.errors)
                    }
                    if(messages.warnings){
                        self.warning(messages.warnings)
                    }
                    if(messages.success){
                        self.success(messages.success)
                    }
                    if(messages.info){
                        self.info(messages.info)
                    }
                });
            }
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
    });