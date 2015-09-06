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

    dataservice.$inject = ['$http', 'APP_CONFIG', 'logger', '$exceptionHandler', '$q'];

    function dataservice($http, APP_CONFIG, logger, $exceptionHandler, $q) {

        var that = this;
        var debugName = 'dataservice';

        // used to optimize save() method. The last saved state is always updated
        // before a save to know if it's useful or not to make a request
        var _lastSavedState = {
            user: null
        };
        
        return {
            getWidgets: getWidgets,
            updateWidget: updateWidget,
            getProfiles: getProfiles,
            getProfile: getProfile,
            createProfile: createProfile,
            updateProfile: updateProfile,
            updateAccount: updateAccount,

            widgets: {
                browse: widgetsBrowse,
                addToProfile: addWidgetToProfile,
                removeFromProfile: removeWidgetFromProfile
            }
        };

        /**
         * Activate a widget for a profile
         * @param data
         */
        function addWidgetToProfile(profile, widget, location){
            var route = APP_CONFIG.routes.api.widgets.addToProfile;
            return $http.post(route, {
                    profile: profile,
                    widget: widget,
                    location: location
                })
                .then(function(data) {
                    logger.debug(debugName + ' addWidgetToProfile success!', data.data);
                    return data.data;
                })
                .catch(function(error) {
                    logger.error(debugName + ' addWidgetToProfile failure!', error);
                    throw new Error(error);
                });
        }

        function removeWidgetFromProfile(profile, identity, location){
            var route = APP_CONFIG.routes.api.widgets.removeFromProfile.replace(':profile', profile).replace(':widget', identity);
            return $http.delete(route, {
                location: location
            })
                .then(function(data) {
                    logger.debug(debugName + ' removeWidgetFromProfile success!', data.data);
                    return data.data;
                })
                .catch(function(error) {
                    logger.error(debugName + ' removeWidgetFromProfile failure!', error);
                    throw new Error(error);
                });
        }

        function widgetsBrowse(data){
            var route = APP_CONFIG.routes.api.repository.widgets.getAll;
            console.log(route, data);
            return $http.get(route, {
                    params: data
                })
                .then(function(data){
                    return data.data;
                })
                .catch(function(error){
                    throw error; // important to call superior catch
                });
        }

        // check for each data property if the sate's same property is different
        // if one is different then return true
        // @todo
        function noChanges(key, data){

        }
        
        // save all the data to the current state
        // do not overwrite the state but add or rewrite data property
        // @todo
        function saveState(key, data){
            
        }
        
        function updateAccount( data ){
            if(noChanges('user', data)){

            }
            var route = APP_CONFIG.routes.api.account.update;
            return $http.put(route, data)
                .then(function(data){
                    logger.debug(debugName + ' updateAccount success!', data.data);
                    saveState('user', data);
                    return data.data;
                })
                .catch(function(error){
                    logger.error(debugName + ' updateAccount failure!', error);
                    throw error; // important to call superior catch
                });
            
        }
        
        function updateProfile( profile ){
            var data = {
                name: profile.name,
                description: profile.description,
                default: profile.default
            };
            var route = APP_CONFIG.routes.api.profiles.update.replace(':id', profile.id);
            return $http.put(route, data)
                .then(function(data){
                    var profile = data.data;
                    logger.debug(debugName + ' updateProfile success!', data.data);
                    if(!profile.id) throw new Error(debugName + ' Invalid response for profile ' + route);
                    return data.data;
                })
                .catch(function(error){
                    logger.error(debugName + ' updateProfile failure!', error);
                    throw error; // important to call superior catch
                });
        }

        function getProfiles(){
            var route = APP_CONFIG.routes.api.profiles.getAll;
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
            var route = APP_CONFIG.routes.api.profiles.get.replace(':id', id);
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

        function createProfile(profile){
            var route = APP_CONFIG.routes.api.profiles.create;
            var data = {
                name: profile.name,
                description: profile.description
            };
            return $http.post(route, data)
                .then(function(data) {
                    logger.debug(debugName + ' createProfile success!', data.data);
                    return data.data;
                })
                .catch(function(error) {
                    logger.error(debugName + ' createProfile failure!', error);
                    throw new Error(APP_CONFIG.messages.errors.unableToLoad);
                });
        }

        function getWidgets( profileID ){
            var data = {
                params: {
                    profile: profileID
                }
            };
            var route = APP_CONFIG.routes.api.widgets.getAll;
            return $http.get(route, data)
                .then(function(data) {
                    logger.debug(debugName + 'Widgets loaded successfully!', data.data);
                    var widgets = data.data;
                    return widgets;
                })
                .catch(function(error) {
                    logger.error(debugName + 'Failure loading widgets');
                    throw new Error(APP_CONFIG.messages.errors.widgets.unableToLoad);
                });
        }

        function updateWidget( widget ){
            return update(widget.id, {
                sizeX: widget.sizeX,
                sizeY: widget.sizeY,
                row: widget.row,
                col: widget.col,
                options: widget.options
            });
        }

        function update(id, data){
            var route = APP_CONFIG.routes.api.widgets.update.replace(':id', id);
            return $http.put(route, data).then(function(data) {
                logger.debug(debugName + 'Widget updated successfully!', data.data);
                return data.data;
            })
            .catch(function(err) {
                    logger.error(debugName + 'Failure while updating widget', err);
                    throw new Error(APP_CONFIG.messages.errors.widgets.unableToUpdate);
            });
        }

    }

})();