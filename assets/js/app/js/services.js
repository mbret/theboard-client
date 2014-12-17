app.factory('batchLog', ['$interval', '$log', function($interval, $log) {
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
}]);