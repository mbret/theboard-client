/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */

angular
    .module('app.services', [])

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
     * Widget service
     *
     */
    .factory('widgetService', ['$rootScope', '$http', '$log', 'settings', function($rootScope, $http, $log, settings){

        return {
            get: function(){
                return $http.get(settings.routes.widgets.get)
                    .then(function(data) {
                        $log.debug('Widgets loaded successfully!');
                        return data.data;
                    })
                    .catch(function(error) {
                        $log.error('Failure loading widgets');
                        return error;
                    });
            },

            update: function( widgets ){
                return $http.put(settings.routes.widgets.update)
                    .then(function(data) {
                        $log.debug('Widgets loaded successfully!');
                        return data.data;
                    })
                    .catch(function(error) {
                        $log.error('Failure loading widgets');
                        return error;
                    });
            },

            sendSignal: function( widget, signal ){
                console.log(widget);
                if(widget) $log.debug('Signal ' + signal + ' sent to widget ' + widget.identity);
                else $log.debug('Signal ' + signal + ' sent to everyone');
                $rootScope.$broadcast('widget-signal', widget, signal);
                return;
            }
        }

    }])

    .factory('geolocationService', ['$q','$rootScope','$window','messages',function ($q,$rootScope,$window,messages) {
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
                                    deferred.reject(messages.errors.geolocation.permissionDenied);
                                //});
                                break;
                            case 2:
                                //$rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                                //$rootScope.$apply(function() {
                                    deferred.reject(messages.errors.geolocation.positionUnavailable);
                                //});
                                break;
                            case 3:
                                //$rootScope.$broadcast('error',geolocation_msgs.errors.geolocation.timeout);
                                //$rootScope.$apply(function() {
                                    deferred.reject(messages.errors.geolocation.timeout);
                                //});
                                break;
                        }
                    }, opts);
                }
                else
                {
                    //$rootScope.$broadcast('error',messages.errors.geolocation.unsupportedBrowser);
                    //$rootScope.$apply(function(){deferred.reject(messages.errors.geolocation.unsupportedBrowser);});
                    deferred.reject(messages.errors.geolocation.unsupportedBrowser);
                }
                return deferred.promise;
            }
        };
    }]);