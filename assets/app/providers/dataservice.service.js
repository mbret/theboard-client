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

    dataservice.$inject = ['$http', 'APP_CONFIG', 'logger', '$exceptionHandler'];

    function dataservice($http, APP_CONFIG, logger, $exceptionHandler) {

        var that = this;
        var debugName = 'dataservice';

        return {
            getWidgets: getWidgets,
            getWidgetsByProfile: getWidgetsByProfile,
            updateWidget: updateWidget,
            getProfiles: getProfiles,
            getProfile: getProfile,
            updateProfile: updateProfile
        };

        function updateProfile( profile ){
            return $http.put(APP_CONFIG.routes.user.profiles.update + '/' + profile.id, profile)
                .then(function(data){
                    var profile = data.data;
                    logger.debug(debugName + ' updateProfile success!', data.data);
                    if(!profile.id) throw new Error(debugName + 'Invalid response for profile');
                    return data.data;
                })
                .catch(function(error){
                    logger.error(debugName + ' updateProfile failure!', error);
                    throw error; // important to call superior catch
                });
        }

        function getProfiles(){
            var route = APP_CONFIG.routes.user.profiles.get.replace(':id', "");
            return $http.get(route)
                .then(function(data) {
                    logger.debug(debugName + ' getProfiles success!', data.data);
                    return data.data;
                })
                .catch(function(error) {
                    logger.error(debugName + ' getProfiles failure!', error);
                    throw new Error(APP_CONFIG.messages.errors.unableToLoad);
                });
        }
        
        function getProfile(id){
            var route = APP_CONFIG.routes.user.profiles.get.replace(':id', id);
            return $http.get(route)
                .then(function(data) {
                    logger.debug(debugName + ' getProfile success!', data.data);
                    return data.data;
                })
                .catch(function(error) {
                    logger.error(debugName + ' getProfile failure!', error);
                    throw new Error(APP_CONFIG.messages.errors.unableToLoad);
                });
        }

        function getWidgets(){
            var route = APP_CONFIG.routes.widgets.get;
            return $http.get(route)
                .then(function(data) {
                    logger.debug('Widgets loaded successfully!', data.data);
                    var widgets = data.data;
                    return widgets;
                })
                .catch(function(error) {
                    logger.error('Failure loading widgets');
                    throw new Error(APP_CONFIG.messages.errors.widgets.unableToLoad);
                });
        }

        function getWidgetsByProfile( profileID ){
            var route = APP_CONFIG.routes.widgets.getByProfile.replace(':id', profileID);
            return $http.get(route)
                .then(function(data) {
                    logger.debug('Widgets loaded successfully!', data.data);
                    var widgets = data.data;
                    return widgets;
                })
                .catch(function(error) {
                    logger.error('Failure loading widgets');
                    throw new Error(APP_CONFIG.messages.errors.widgets.unableToLoad);
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
            return $http.put(APP_CONFIG.routes.widgets.update + '/' + id, data).then(function(data) {
                logger.debug('Widget updated successfully!', data.data);
                return data.data;
            })
            .catch(function(err) {
                    logger.error('Failure while updating widget', err);
                    throw new Error(APP_CONFIG.messages.errors.widgets.unableToUpdate);
            });
        }

    }

})();