(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .factory('widgetService', widgetService);

    /**
     * Widget service
     * http://blog.revolunet.com/blog/2014/02/14/angularjs-services-inheritance/
     */
    widgetService.$inject = ['$rootScope', '$http', 'logger', 'APP_CONFIG', '$window', 'Widget', 'dataservice'];
    function widgetService($rootScope, $http, logger, APP_CONFIG, $window, Widget, dataservice){

        return {

            VIEW_STATE_READY: 'ready',
            VIEW_STATE_LOADING: 'loading',
            VIEW_STATE_RELOADING: 'reloading',
            VIEW_STATE_WAIT_LOCATION: 'location',

            SIGNAL_REFRESH: 'refresh',
            SIGNAL_STOP: 'stop',
            SIGNAL_START: 'start',

            setViewState: function(widget, state){
                //console.log(widget, state);
                $rootScope.$broadcast('widget.state.changed', widget.id, state);
            },
            
            /**
             * Return all widgets objects for a specific profile.
             * @param {number} profileID use specific profile instead of default session
             * @returns {*}
             */
            getAll: function(profileID){
                if(!_.isNumber(profileID)){
                    throw new Error('A profile id is required');
                }
                return dataservice.getWidgets(profileID).then(function(widgets){
                    var models = [];
                    widgets.forEach(function(widget){
                        models.push( new Widget(widget) );
                    });
                    return models;
                });
            },

            /**
             * This method reload the widget iframe
             * @param widget
             */
            reload: function(widget){
                if(widget.isReady){
                    logger.debug('Widget service reload', widget);
                    widget.buildIframeURL();
                    $rootScope.$broadcast('widget.reload', widget);
                }
            },

            /**
             * This method load the widget iframe
             * @param widget
             */
            load: function(widget){
                if(widget.isReady){
                    logger.debug('Widget service load', widget);
                    widget.buildIframeURL();
                    $rootScope.$broadcast('widget.load', widget);
                }
            },

            /**
             * Send signal to one widget or all widgets.
             * @param widget
             * @param signal
             */
            sendSignal: function( widgets, signal ){
                if(widgets && Array.isArray(widgets)){
                    console.log('dfsdf');
                    _.forEach(widgets, function(widget){
                        if(widget.isReady){
                            $rootScope.$broadcast('widget.signal', widget, signal, JSON.stringify({signal:signal}));
                        }
                    });
                }
                else if(widgets && widgets.isReady){
                    $rootScope.$broadcast('widget.signal', widgets, signal, JSON.stringify({signal:signal}));
                }
            },

            reloadAll: function(widgets){
                var self = this;
                _.forEach(widgets, function(widget){
                    self.reload(widget);
                });
            },

            /**
             * Add a widget to the given profile
             * @param widgetIdentity
             * @param profileId
             * @param location
             * @returns {*|Promise}
             */
            add: function(widgetId, profileId, location){
                if(!widgetId || !profileId || !location){
                    throw new Error('Params required', widgetId, profileId, location);
                }
                return dataservice.widgets.addToProfile(profileId, widgetId, location);
            },

            /**
             * Remove a widget from the given profile
             * @param widgetIdentity
             * @param profileId
             * @param location
             * @returns {*}
             */
            remove: function(widgetId, profileId, location){
                if(!widgetId || !profileId || !location){
                    throw new Error('Params required', widgetId, profileId, location);
                }
                return dataservice.widgets.removeFromProfile(profileId, widgetId, location);
            }

        }
    }

})();