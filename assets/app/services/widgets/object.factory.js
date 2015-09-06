(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .factory('Widget', Widget);

    Widget.$inject = ['$window', '$http', 'APP_CONFIG', 'logger', 'notifService', '$injector', 'URI'];

    /**
     * This is a Widget model factory
     *
     */
    function Widget($window, $http, APP_CONFIG, logger, notifService, $injector, URI) {
        
        var Widget = function(data){
            logger.debug('Widget: A new widget is created', data);
            this.id = data.id;
            this.iframeURL = data.iframeURL;
            this.oldState;
            this.location = data.location; // local / remote
            this.isReady = false; // isReady = true when widget is fully ready for the view (geoloc, etc)
            
            // @todo remove it and set all attribute in hard
            for(var prop in data){
                this[prop] = data[prop];
            }
            
            // Contain the state of iframe
            var state = null;
            this.options = data.options ? data.options : [];
            this.saveState(); // keep trace of current state
        };
        
        Widget.prototype.__defineGetter__("STATE_RELOADING", function(){ return 'reloading' });
        Widget.prototype.hasOptions = hasOptions;
        Widget.prototype.getOptionValue = getOptionValue;
        Widget.prototype.getState = getState;
        Widget.prototype.setState = setState;

        Widget.prototype.buildIframeURL = function (){
            console.log(this);
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
            var uri = new URI(this.baseURL).search({widget:JSON.stringify(configuration)}).toString();
            this.iframeURL = uri;
            //logger.debug('Widget build its URL', URI);
        };
        
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
        };
        
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

})();