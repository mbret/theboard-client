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
                return $http.get(settings.routes.widgets)
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

    }]);