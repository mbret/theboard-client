(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .factory('Widget', Widget)
        .factory('widgetService', widgetService);
    
    Widget.$inject = ['$window', '$http', 'APP_CONFIG', 'logger', 'notifService', '$injector'];

    /**
     * This is a Widget model factory
     *
     */
    function Widget($window, $http, APP_CONFIG, logger, notifService, $injector) {
        
        var Widget = function(widget){
            this.id = widget.id;
            this.iframeURL = widget.iframeURL;
            this.oldState;
            this.isReady = false; // isReady = true when widget is fully ready for the view (geoloc, etc)
            
            // @todo remove it and set all attribute in hard
            for(var prop in widget){
                this[prop] = widget[prop];
            }
            
            // Contain the state of iframe
            var state = null;
            this.options = widget.options ? widget.options : [];
            this.saveState(); // keep trace of current state
        };
        
        Widget.prototype.__defineGetter__("STATE_RELOADING", function(){ return 'reloading' });
        Widget.prototype.hasOptions = hasOptions;
        Widget.prototype.getOptionValue = getOptionValue;
        Widget.prototype.getState = getState;
        Widget.prototype.setState = setState;
        Widget.prototype.buildIframeURL = buildIframeURL;
        
        /**
         * Save the current state like position, size etc
         */
        Widget.prototype.saveState = function(){
            this.oldState = {
                sizeX: this.sizeX,
                sizeY: this.sizeY,
                row: this.row,
                col: this.col
            }
        }
        
        Widget.prototype.setOptionValue = function(id, value){
            angular.forEach(this.options, function(option){
                if(option.id === id){
                    option.value = value;
                }
            })
        };
        
        /**
         * Take an associative array of options
         * @param options
         */
        Widget.prototype.setOptionsValues = function(options){
            var that = this;
            angular.forEach(options, function(value, id){
                that.setOptionValue(id, value);
            });
        };
        
        function setState(state){

        }
        
        function getState(){
            
        }

        function getOptionValue(id){
            var optionValue = null;
            angular.forEach(this.options, function(option){
                if(option.id === id){
                    optionValue = option.value;
                }
            });
            return optionValue;
        };
        
        function buildIframeURL(){
            // prepare options for widget
            var options = {};
            angular.forEach(this.options, function(option, index){
                options[option.id] = option.value;
            });

            // Prepare finally the widget conf to send to widget
            // It contain only needed information
            var configuration = {
                identity: this.identity,
                identityHTML: this.identityHTML,
                permissions: this.permissions,
                options: options
            };
            var URI = $window.URI(this.baseURL).search({widget:JSON.stringify(configuration)}).toString();
            this.iframeURL = URI;
            //logger.debug('Widget build its URL', URI);
        }

        /**
         * Check if the widget has options
         * @returns {boolean}
         */
        function hasOptions(){
            return this.options.length > 0;
        }
        
        Widget.prototype.hasStateChanged = function(){
            return (this.col !== this.oldState.col
            || this.row !== this.oldState.row
            || this.sizeX !== this.oldState.sizeX
            || this.sizeY !== this.oldState.sizeY);
        }

        return Widget;
    }

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
             *
             * @param profileID
             * @returns {*}
             */
            getAll: function(profileID){
                return dataservice.getWidgets(profileID).then(function(widgets){
                    var models = [];
                    angular.forEach(widgets, function(widget){
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

            addToProfile: function(widgetIdentity, profileId, location){
                return dataservice.widgets.addToProfile(profileId, widgetIdentity, location);
            },

            removeFromProfile: function(widgetIdentity, profileId, location){
                return dataservice.widgets.removeFromProfile(profileId, widgetIdentity, location);
            }

        }
    }

})();