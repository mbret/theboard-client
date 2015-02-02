(function () {
    'use strict';

    /**
     * Data service
     * This service expose function that get data from server
     * This service must be used in any other portion of code to retrieve remote data.
     * It's the only service which should retrieve data from server
     */
    angular
        .module('app')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', 'config', '$log', 'widgetService'];

    function dataservice($http, config, $log, widgetService) {

        var that = this;
        
        return {
            getWidgets: getWidgets,
            updateWidget: updateWidget
        };

        function getWidgets(){
            return $http.get(config.routes.widgets.get)
                .then(function(data) {
                    $log.debug('Widgets loaded successfully!', data.data);
                    var widgets = data.data;
                    return widgetService._buildBaseWidget(widgets);
                })
                .catch(function(error) {
                    $log.error('Failure loading widgets');
                    throw new Error(config.messages.errors.widgets.unableToLoad);
                });
        }

        function updateWidget( widget ){
            return update(widget.id, {
                sizeX: widget.sizeX,
                sizeY: widget.sizeY,
                row: widget.row,
                col: widget.col
            });
        }

        function update(id, data){
            return $http.put(config.routes.widgets.update + '/' + id, data).then(function(data) {
                $log.debug('Widget updated successfully!', data.data);
                return data.data;
            })
            .catch(function(err) {
                $log.error('Failure while updating widget', err);
                throw new Error(config.messages.errors.widgets.unableToUpdate);
            });
        }

    }

})();